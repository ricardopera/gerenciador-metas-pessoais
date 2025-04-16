# Script para build e deploy manual local
# Este script faz o build do frontend com a URL correta da API
# e prepara os arquivos para implantação manual no Azure Static Web Apps

# Configurações
$apiUrl = "https://metas-api-dev.azurewebsites.net/api"
$clientFolder = Join-Path $PSScriptRoot "client"
$buildFolder = Join-Path $clientFolder "build"
$deployZipPath = Join-Path $PSScriptRoot "frontend-deploy.zip"

# Exibir informações iniciais
Write-Host "Iniciando build do frontend com configuração para o Azure..." -ForegroundColor Cyan
Write-Host "API URL: $apiUrl" -ForegroundColor Green

# Navegar para a pasta do cliente
Set-Location -Path $clientFolder

# Criar arquivo .env com a URL da API
$envContent = "REACT_APP_API_URL=$apiUrl`nCI=false"
Set-Content -Path (Join-Path $clientFolder ".env") -Value $envContent

# Verificar se há dependências instaladas
if (-not (Test-Path (Join-Path $clientFolder "node_modules"))) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Configurar variáveis de ambiente para o build
$env:REACT_APP_API_URL = $apiUrl
$env:CI = "false"
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Executar o build
Write-Host "Executando build do React..." -ForegroundColor Green
npm run build

# Verificar se o build foi concluído com sucesso
if (Test-Path $buildFolder) {
    # Mostrar arquivos no diretório build para confirmar que o build foi concluído
    Write-Host "`nBuild concluído. Arquivos gerados:" -ForegroundColor Green
    Get-ChildItem -Path $buildFolder | Format-Table Name, Length, LastWriteTime
    
    # Verificar se há algum arquivo index.html para confirmar que o build está completo
    if (Test-Path (Join-Path $buildFolder "index.html")) {
        Write-Host "Arquivo index.html encontrado no build. Parece estar completo." -ForegroundColor Green
        
        # Criar arquivo ZIP para possível implantação manual
        if (Test-Path $deployZipPath) {
            Remove-Item -Path $deployZipPath -Force
        }
        
        Write-Host "`nCriando ZIP para implantação manual..." -ForegroundColor Yellow
        Compress-Archive -Path "$buildFolder\*" -DestinationPath $deployZipPath -Force
        Write-Host "ZIP criado em: $deployZipPath" -ForegroundColor Green
        
        # Exibir instruções para upload manual
        Write-Host "`nInstruções para implantação manual:" -ForegroundColor Cyan
        Write-Host "1. Faça login no portal do Azure: https://portal.azure.com" -ForegroundColor White
        Write-Host "2. Navegue até o recurso Static Web App (metas-frontend-dev)" -ForegroundColor White
        Write-Host "3. Vá para 'Implantação/Deployment' > 'Implantações manuais'" -ForegroundColor White
        Write-Host "4. Faça upload do arquivo ZIP criado ($deployZipPath)" -ForegroundColor White
        Write-Host "`nAlternativamente, use o Visual Studio Code com a extensão 'Azure Static Web Apps' para implantar a pasta 'build'" -ForegroundColor White
    } else {
        Write-Host "AVISO: Não foi possível encontrar index.html no build. Verifique se o build foi completo." -ForegroundColor Red
    }
} else {
    Write-Host "ERRO: Não foi possível concluir o build. Verifique os erros acima." -ForegroundColor Red
}

# Retornar ao diretório original
Set-Location -Path $PSScriptRoot