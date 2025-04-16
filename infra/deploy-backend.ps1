# Script de implantação para o backend no Azure App Service
param(
    [Parameter(Mandatory=$false)]
    [string]$resourceGroupName = "metas-backend-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$location = "eastus2",
    
    [Parameter(Mandatory=$false)]
    [string]$appName = "metas-api",
    
    [Parameter(Mandatory=$false)]
    [string]$environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [string]$mongoDbUri,
    
    [Parameter(Mandatory=$false)]
    [string]$jwtSecret,
    
    [Parameter(Mandatory=$false)]
    [string]$appServicePlanSku = "F1" # Alterado para F1 por padrão
)

# Exibir informações iniciais
Write-Host "Iniciando implantação do backend do Gerenciador de Metas Pessoais..." -ForegroundColor Cyan
Write-Host "Usando o plano App Service: $appServicePlanSku (F1 = gratuito)" -ForegroundColor Cyan

# Verificar login no Azure
$loginCheck = az account show --query name -o tsv 2>$null
if (-not $loginCheck) {
    Write-Host "Você precisa fazer login no Azure primeiro..." -ForegroundColor Yellow
    az login
}

# Criar grupo de recursos se não existir
$rgExists = az group exists --name $resourceGroupName
if ($rgExists -eq "false") {
    Write-Host "Criando grupo de recursos $resourceGroupName em $location..." -ForegroundColor Green
    az group create --name $resourceGroupName --location $location
}
else {
    Write-Host "Grupo de recursos $resourceGroupName já existe." -ForegroundColor Green
}

# Preparar arquivos para implantação
Write-Host "Preparando arquivos para implantação..." -ForegroundColor Green

# Executar validação do template Bicep
Write-Host "Validando template Bicep..." -ForegroundColor Green
az deployment group what-if --resource-group $resourceGroupName `
    --template-file "$PSScriptRoot/main.bicep" `
    --parameters appName=$appName environment=$environment appServicePlanSku=$appServicePlanSku

# Perguntar ao usuário se deseja continuar
$confirmation = Read-Host "Deseja continuar com a implantação? (s/n)"
if ($confirmation -ne "s") {
    Write-Host "Implantação cancelada." -ForegroundColor Red
    exit
}

# Implantar recursos usando o template Bicep
Write-Host "Implantando recursos no Azure..." -ForegroundColor Green
$deployment = az deployment group create --resource-group $resourceGroupName `
    --template-file "$PSScriptRoot/main.bicep" `
    --parameters appName=$appName environment=$environment appServicePlanSku=$appServicePlanSku `
    --query properties.outputs

# Extrair nomes dos recursos criados
$appServiceName = ($deployment | ConvertFrom-Json).appServiceName.value
$keyVaultName = ($deployment | ConvertFrom-Json).keyVaultName.value

# Solicitar informações do MongoDB URI e JWT Secret se não fornecidas
if (-not $mongoDbUri) {
    $mongoDbUri = Read-Host "Informe a URI de conexão do MongoDB (mongodb+srv://...)"
}

if (-not $jwtSecret) {
    $jwtSecret = Read-Host "Informe o segredo para JWT (mínimo 32 caracteres)"
}

# Salvar segredos no Key Vault
Write-Host "Salvando segredos no Key Vault..." -ForegroundColor Green
az keyvault secret set --vault-name $keyVaultName --name "MongoDbUri" --value $mongoDbUri
az keyvault secret set --vault-name $keyVaultName --name "JwtSecret" --value $jwtSecret

# Criar arquivo ZIP com o código do backend
$tempFolder = Join-Path $env:TEMP "metas-backend-deploy"
$zipPath = Join-Path $env:TEMP "backend-deploy.zip"
$serverFolder = Join-Path $PSScriptRoot "../server"

# Remover arquivos temporários se existirem
if (Test-Path $tempFolder) {
    Remove-Item -Path $tempFolder -Recurse -Force
}
if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force
}

# Criar pasta temporária
New-Item -ItemType Directory -Force -Path $tempFolder | Out-Null

# Copiar arquivos do servidor para a pasta temporária
Write-Host "Copiando arquivos do backend para pasta temporária..." -ForegroundColor Green
Copy-Item -Path "$serverFolder/*" -Destination $tempFolder -Recurse

# Remover pastas node_modules e .env se existirem
if (Test-Path "$tempFolder/node_modules") {
    Remove-Item -Path "$tempFolder/node_modules" -Recurse -Force
}
if (Test-Path "$tempFolder/.env") {
    Remove-Item -Path "$tempFolder/.env" -Force
}

# Criar arquivo ZIP para implantação
Write-Host "Criando arquivo ZIP para implantação..." -ForegroundColor Green
Compress-Archive -Path "$tempFolder/*" -DestinationPath $zipPath

# Implantar código no App Service
Write-Host "Implantando código no App Service..." -ForegroundColor Green
az webapp deployment source config-zip --resource-group $resourceGroupName --name $appServiceName --src $zipPath

# Informar sobre limitações do plano gratuito se aplicável
if ($appServicePlanSku -eq "F1") {
    Write-Host "`nInformações importantes sobre o plano F1 gratuito:" -ForegroundColor Yellow
    Write-Host "- Limitado a 60 minutos de CPU por dia" -ForegroundColor Yellow
    Write-Host "- Pode hibernar após 20 minutos de inatividade" -ForegroundColor Yellow
    Write-Host "- Limitado a 1GB de RAM e 1GB de armazenamento" -ForegroundColor Yellow
    Write-Host "- Não suporta escalabilidade ou slots de implantação" -ForegroundColor Yellow
    Write-Host "- Use apenas para desenvolvimento/testes" -ForegroundColor Yellow
}

Write-Host "`nImplantação concluída com sucesso!" -ForegroundColor Cyan
Write-Host "URL da API: https://$appServiceName.azurewebsites.net" -ForegroundColor Green