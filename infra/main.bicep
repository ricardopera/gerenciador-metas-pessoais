@description('Nome do aplicativo (usará este nome como base para todos os recursos)')
param appName string = 'metas-api'

@description('Local onde os recursos serão implantados')
param location string = resourceGroup().location

@description('Ambiente (dev, test, prod)')
param environment string = 'dev'

@allowed([
  'F1'
  'B1'
  'B2'
  'B3'
  'S1'
])
@description('Tamanho do plano do App Service (F1 é o tier gratuito)')
param appServicePlanSku string = 'F1'

// Variáveis para nomes de recursos
var appServicePlanName = '${appName}-plan-${environment}'
var appServiceName = '${appName}-${environment}'
// Verificar se o plano é gratuito para configuração condicional
var isFreeplan = appServicePlanSku == 'F1'

// App Service Plan (servidor)
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    capacity: isFreeplan ? 1 : 1 // Sempre 1 instância no tier gratuito
  }
  kind: 'linux'
  properties: {
    reserved: true // Necessário para Linux
  }
  tags: {
    'ambiente': environment
    'aplicacao': appName
  }
}

// App Service para o backend Node.js
resource appService 'Microsoft.Web/sites@2021-02-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: !isFreeplan // O tier F1 não suporta alwaysOn
      minTlsVersion: '1.2'
      http20Enabled: true
      cors: {
        allowedOrigins: [
          '*' // Permite qualquer origem - ajuste conforme necessário
        ]
      }
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'MONGODB_URI'
          value: '@Microsoft.KeyVault(SecretUri=https://${appName}-kv-${environment}.vault.azure.net/secrets/MongoDbUri/)'
        }
        {
          name: 'JWT_SECRET'
          value: '@Microsoft.KeyVault(SecretUri=https://${appName}-kv-${environment}.vault.azure.net/secrets/JwtSecret/)'
        }
        // Configuração para evitar inatividade no tier gratuito
        {
          name: 'WEBSITE_WARMUP_PATH'
          value: '/api/health'
        }
      ]
    }
  }
  tags: {
    'ambiente': environment
    'aplicacao': appName
  }
}

// Key Vault para armazenar segredos
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${appName}-kv-${environment}'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enableRbacAuthorization: true
  }
  tags: {
    'ambiente': environment
    'aplicacao': appName
  }
}

// Identidade gerenciada para o App Service
resource appServiceIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: '${appName}-identity-${environment}'
  location: location
  tags: {
    'ambiente': environment
    'aplicacao': appName
  }
}

// Atribuir identidade gerenciada ao App Service
resource appServiceIdentityAssignment 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${appService.name}/web'
  properties: {
    managedServiceIdentity: {
      type: 'UserAssigned'
      userAssignedIdentities: {
        '${appServiceIdentity.id}': {}
      }
    }
  }
}

// Permissão para o App Service acessar o Key Vault
resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2022-07-01' = {
  parent: keyVault
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: appServiceIdentity.properties.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
        }
      }
    ]
  }
}

// Saídas
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServiceName string = appService.name
output keyVaultName string = keyVault.name
output appServicePlanName string = appServicePlan.name