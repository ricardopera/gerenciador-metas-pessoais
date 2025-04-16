# Script para fazer commit e push das alterações realizadas
# Especialmente relacionadas à configuração do Azure Static Web Apps e URL da API

# Exibe o status atual para revisão
Write-Host "Status atual do repositório:" -ForegroundColor Cyan
git status

# Adiciona todos os arquivos modificados e novos
Write-Host "`nAdicionando arquivos modificados e novos..." -ForegroundColor Yellow
git add .github/workflows/azure-static-web-apps-salmon-coast-0a4562a0f.yml
git add build-and-deploy-local.ps1
git add client/.env
git add .

# Cria o commit com uma mensagem descritiva
$commitMessage = "Configura URL da API e corrige implantação no Azure Static Web Apps"
Write-Host "`nCriando commit: $commitMessage" -ForegroundColor Green
git commit -m $commitMessage

# Verifica se o commit foi criado com sucesso
$commitSuccess = $?
if (-not $commitSuccess) {
    Write-Host "`nErro ao criar o commit. Verifique se há alterações para commit." -ForegroundColor Red
    exit 1
}

# Exibe os últimos commits para verificação
Write-Host "`nÚltimos commits:" -ForegroundColor Cyan
git log --oneline -n 3

# Faz o push para o repositório remoto
Write-Host "`nEnviando alterações para o repositório remoto (git push)..." -ForegroundColor Yellow
git push origin main

# Verifica se o push foi bem-sucedido
$pushSuccess = $?
if ($pushSuccess) {
    Write-Host "`nPush concluído com sucesso! As alterações foram enviadas para o repositório remoto." -ForegroundColor Green
    Write-Host "O workflow do GitHub Actions deve iniciar automaticamente para reimplantar o frontend." -ForegroundColor Green
    Write-Host "Verifique o status da implantação em: https://github.com/[seu-usuario]/gerenciador-metas-pessoais/actions" -ForegroundColor Cyan
} else {
    Write-Host "`nErro ao fazer push para o repositório remoto." -ForegroundColor Red
    Write-Host "Verifique se você tem permissão para fazer push neste repositório e se o remote está configurado corretamente." -ForegroundColor Yellow
    
    # Instruções para configurar o remote em caso de erro
    Write-Host "`nPara verificar o remote configurado, execute:" -ForegroundColor Yellow
    Write-Host "git remote -v" -ForegroundColor White
    
    # Instruções para configurar o remote se necessário
    Write-Host "`nPara configurar o remote, execute:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/[seu-usuario]/gerenciador-metas-pessoais.git" -ForegroundColor White
}