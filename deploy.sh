#!/bin/bash

# Script de deployment para Azure App Service

echo "Iniciando processo de deploy no Azure App Service..."

# Diretório de deploy
DEPLOYMENT_TARGET=$DEPLOYMENT_TARGET

# Verificar se o diretório existe
if [ ! -d "$DEPLOYMENT_TARGET" ]; then
  echo "Diretório de deploy não existe. Criando $DEPLOYMENT_TARGET"
  mkdir -p "$DEPLOYMENT_TARGET"
fi

# Copiar todos os arquivos para o diretório de deploy
echo "Copiando arquivos para o diretório de deploy..."
cp -r ./server/* $DEPLOYMENT_TARGET

# Instalar dependências do servidor
echo "Instalando dependências do servidor..."
cd $DEPLOYMENT_TARGET
npm install --production --no-optional

# Definir NODE_ENV como production
echo "Configurando ambiente de produção..."
export NODE_ENV=production

echo "Deploy concluído com sucesso!"
exit 0