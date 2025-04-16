// Script de inicialização específico para Azure
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Iniciando script de startup para Azure com Node.js 20+...');

try {
  // Verificar se as dependências já foram instaladas
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  const needsInstall = !fs.existsSync(nodeModulesPath) || 
                       !fs.existsSync(path.join(nodeModulesPath, 'express'));

  if (needsInstall) {
    console.log('Instalando dependências do servidor...');
    try {
      // Em versões mais recentes do Node.js, podemos usar a flag --omit=dev em vez de --production
      execSync('npm install --omit=dev', { stdio: 'inherit' });
      console.log('Dependências instaladas com sucesso!');
    } catch (error) {
      console.error('Erro ao instalar dependências:', error);
      process.exit(1);
    }
  } else {
    console.log('Dependências já estão instaladas, pulando a instalação');
  }

  // Definir variáveis de ambiente se não existirem
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }

  // Verificar versão do Node.js
  const nodeVersion = process.version;
  console.log(`Usando Node.js ${nodeVersion}`);

  // Iniciar o servidor
  console.log('Iniciando aplicação...');
  require('./server.js');
} catch (error) {
  console.error('Erro durante a inicialização:', error);
  process.exit(1);
}