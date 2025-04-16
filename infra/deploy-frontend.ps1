# Script de implantação para o frontend no Azure Static Web Apps
param(
    [Parameter(Mandatory=$false)]
    [string]$resourceGroupName = "metas-frontend-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$location = "eastus",
    
    [Parameter(Mandatory=$false)]
    [string]$appName = "metas-frontend",
    
    [Parameter(Mandatory=$false)]
    [string]$backendUrl = "https://metas-api-dev.azurewebsites.net",
    
    [Parameter(Mandatory=$false)]
    [string]$environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [string]$sku = "Free" # Explicitamente configurado como gratuito
)

# Exibir informações iniciais
Write-Host "Iniciando implantação do frontend do Gerenciador de Metas Pessoais..." -ForegroundColor Cyan
Write-Host "Usando o plano Static Web App: $sku" -ForegroundColor Cyan

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

# Atualizar o arquivo de configuração do Static Web App para apontar para o backend correto
$configFilePath = Join-Path $PSScriptRoot "../client/staticwebapp.config.json"
$configContent = Get-Content $configFilePath -Raw | ConvertFrom-Json

# Atualizar a URL do backend
foreach ($route in $configContent.routes) {
    if ($route.route -eq "/api/*") {
        $route.rewrite = "$backendUrl/api/:splat"
    }
}

# Salvar as alterações no arquivo de configuração
$configContent | ConvertTo-Json -Depth 10 | Set-Content $configFilePath

# Build do frontend
Write-Host "Fazendo build do frontend..." -ForegroundColor Green
$clientFolder = Join-Path $PSScriptRoot "../client"
Set-Location -Path $clientFolder

# Executar npm install se necessário
if (-not (Test-Path "$clientFolder/node_modules")) {
    Write-Host "Instalando dependências do frontend..." -ForegroundColor Green
    npm install
}

# Definir variáveis de ambiente para o build
$env:REACT_APP_API_URL = $backendUrl
# Em PowerShell, não usamos && - corrigindo para usar ;
$env:CI = "false" 

# Executar o build
Write-Host "Executando build do React..." -ForegroundColor Green
npm run build

# Criar Static Web App
Write-Host "Criando Static Web App no Azure..." -ForegroundColor Green
$staticWebAppName = "$appName-$environment"

# Verificar se o Static Web App já existe
$staticWebAppExists = az staticwebapp list --resource-group $resourceGroupName --query "[?name=='$staticWebAppName'].name" -o tsv

if (-not $staticWebAppExists) {
    Write-Host "Criando Static Web App $staticWebAppName no tier gratuito..." -ForegroundColor Green
    
    # Criar Static Web App com o plano explicitamente definido como Free
    az staticwebapp create --name $staticWebAppName `
        --resource-group $resourceGroupName `
        --location $location `
        --sku $sku

    # Aguardar um pouco para o recurso ser criado totalmente
    Write-Host "Aguardando a criação do recurso..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}
else {
    Write-Host "Static Web App $staticWebAppName já existe." -ForegroundColor Green
    
    # Verificar o sku atual e atualizar se necessário
    $currentSku = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroupName --query "sku.name" -o tsv
    if ($currentSku -ne $sku) {
        Write-Host "Atualizando o plano do Static Web App para $sku..." -ForegroundColor Yellow
        az staticwebapp update --name $staticWebAppName --resource-group $resourceGroupName --sku $sku
    }
}

# Build do frontend
$buildPath = Join-Path $clientFolder "build"

# Verificar versão da Azure CLI
$azVersion = az version --query '"azure-cli"' -o tsv

# Método mais confiável - usando a API REST com token SAS
Write-Host "Implantando frontend no Static Web App..." -ForegroundColor Green

try {
    # Criar um token SAS para implantação
    Write-Host "Criando token SAS para implantação..." -ForegroundColor Yellow
    
    # Preparar o ZIP para implantação
    $deployZipPath = Join-Path $env:TEMP "frontend-deploy.zip"
    if (Test-Path $deployZipPath) {
        Remove-Item -Path $deployZipPath -Force
    }
    
    # Criar arquivo ZIP para implantação
    Write-Host "Criando arquivo ZIP para implantação..." -ForegroundColor Green
    Compress-Archive -Path "$buildPath\*" -DestinationPath $deployZipPath -Force
    
    # Método 1: Usar o GitHub Actions como alternativa
    Write-Host "Para implantações mais confiáveis, considere usar GitHub Actions." -ForegroundColor Yellow
    
    # Método 2: Configurar implantação manual via API
    Write-Host "Obtendo detalhes para implantação manual..." -ForegroundColor Yellow
    
    # Obter as credenciais de publicação
    $deploymentZipUrl = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroupName --query "repositoryUrl" -o tsv
    if ($deploymentZipUrl) {
        Write-Host "A implantação via API REST não é suportada para este recurso." -ForegroundColor Yellow
        Write-Host "Use a extensão 'Static Web Apps Deploy' do VS Code para implantar o frontend." -ForegroundColor Yellow
        Write-Host "Ou configure GitHub Actions para implantação automática." -ForegroundColor Yellow
        
        # Usar método alternativo do Azure CLI
        Write-Host "Tentando método alternativo usando Azure Storage como intermediário..." -ForegroundColor Yellow
        
        # Criar storage account temporário
        $storageAccountName = "staticwebdeploy$(Get-Random -Maximum 999999)"
        $containerName = "frontend-deploy"
        
        Write-Host "Criando storage account temporário $storageAccountName..." -ForegroundColor Yellow
        az storage account create --name $storageAccountName --resource-group $resourceGroupName --location $location --sku Standard_LRS
        
        # Criar container
        Write-Host "Criando container para deploy..." -ForegroundColor Yellow
        az storage container create --name $containerName --account-name $storageAccountName
        
        # Upload do ZIP para o Storage
        Write-Host "Enviando ZIP para o Storage..." -ForegroundColor Yellow
        az storage blob upload --account-name $storageAccountName --container-name $containerName --name "deploy.zip" --file $deployZipPath
        
        # Gerar URL SAS
        Write-Host "Gerando URL SAS..." -ForegroundColor Yellow
        $expiry = (Get-Date).AddHours(1).ToString("yyyy-MM-ddTHH:mm:ssZ")
        $sasUrl = az storage blob generate-sas --account-name $storageAccountName --container-name $containerName --name "deploy.zip" --permissions r --expiry $expiry --full-uri --output tsv
        
        Write-Host "Use o VS Code ou GitHub Actions para concluir a implantação." -ForegroundColor Green
        Write-Host "URL para download do pacote de implantação: $sasUrl" -ForegroundColor Green
        
        # Limpar recursos temporários
        Write-Host "Limpando recursos temporários..." -ForegroundColor Yellow
        az storage account delete --name $storageAccountName --resource-group $resourceGroupName --yes
    } else {
        Write-Host "Não foi possível obter detalhes para implantação." -ForegroundColor Red
    }
    
    # Exibir URL do frontend de qualquer forma
    $staticWebAppUrl = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroupName --query "defaultHostname" -o tsv
    if ($staticWebAppUrl) {
        Write-Host "O frontend está disponível em: https://$staticWebAppUrl" -ForegroundColor Cyan
        Write-Host "Mas observe que você precisa completar a implantação usando VS Code ou GitHub Actions." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro durante a implantação: $_" -ForegroundColor Red
    Write-Host "Não foi possível implantar o frontend. Verifique os logs acima para mais detalhes." -ForegroundColor Red
}

# Instruções adicionais
Write-Host "`nInstruções para implantação usando VS Code:" -ForegroundColor Cyan
Write-Host "1. Instale a extensão 'Azure Static Web Apps' no VS Code." -ForegroundColor White
Write-Host "2. Faça login no Azure no VS Code." -ForegroundColor White
Write-Host "3. Clique com botão direito na pasta 'build' do frontend e selecione 'Deploy to Static Web App'." -ForegroundColor White
Write-Host "4. Selecione o recurso '$staticWebAppName' e conclua o assistente." -ForegroundColor White

# Informações sobre limitações do plano gratuito do Static Web App
Write-Host "`nInformações importantes sobre o plano gratuito do Static Web App:" -ForegroundColor Yellow
Write-Host "- Limite de 100 GB de largura de banda por mês" -ForegroundColor Yellow
Write-Host "- Máximo de 2 ambientes personalizados" -ForegroundColor Yellow
Write-Host "- Construção e implementação de até 250 MB" -ForegroundColor Yellow
Write-Host "- Disponível apenas em algumas regiões selecionadas" -ForegroundColor Yellow
Write-Host "- Não inclui suporte a domínios personalizados privados" -ForegroundColor Yellow

Write-Host "`nProcesso de preparação concluído!" -ForegroundColor Green