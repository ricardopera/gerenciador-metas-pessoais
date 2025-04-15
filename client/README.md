# Gerenciador de Metas Pessoais

Este é um aplicativo de gerenciamento de metas pessoais desenvolvido com a stack MERN (MongoDB, Express, React, Node.js). O objetivo do aplicativo é permitir que os usuários criem, visualizem e gerenciem suas metas pessoais de forma intuitiva e eficiente.

## Estrutura do Projeto

O projeto é dividido em duas partes principais: o cliente (frontend) e o servidor (backend).

### Cliente (Frontend)

A parte do cliente é construída com React e está localizada na pasta `client`. A estrutura de diretórios é a seguinte:

- **public/**: Contém arquivos estáticos.
  - `index.html`: Ponto de entrada da aplicação React.
  - `manifest.json`: Configurações do manifesto da aplicação.

- **src/**: Contém o código-fonte da aplicação.
  - **components/**: Componentes reutilizáveis da aplicação.
    - `Dashboard.jsx`: Componente que exibe uma visão geral das metas do usuário.
    - **Goals/**: Componentes relacionados às metas.
      - `GoalForm.jsx`: Permite ao usuário criar novas metas.
      - `GoalItem.jsx`: Representa uma única meta na lista.
      - `GoalList.jsx`: Renderiza uma lista de metas.
    - **Layout/**: Componentes de layout da aplicação.
      - `Header.jsx`: Exibe o cabeçalho da aplicação.
      - `Navigation.jsx`: Fornece links de navegação.
    - **Auth/**: Componentes de autenticação.
      - `Login.jsx`: Permite ao usuário fazer login.
      - `Register.jsx`: Permite ao usuário se registrar.

  - **pages/**: Páginas da aplicação.
    - `HomePage.jsx`: Página inicial da aplicação.
    - `GoalsPage.jsx`: Exibe as metas do usuário.
    - `ProfilePage.jsx`: Exibe as informações do perfil do usuário.

  - **context/**: Contextos para gerenciamento de estado.
    - `AuthContext.jsx`: Gerencia o estado de autenticação do usuário.
    - `GoalContext.jsx`: Gerencia o estado das metas do usuário.

  - **services/**: Serviços para interagir com a API do servidor.
    - `api.js`: Contém funções para interagir com a API.

  - `App.jsx`: Componente principal da aplicação.
  - `index.js`: Ponto de entrada da aplicação React.

- `package.json`: Configuração do npm para o cliente.

### Servidor (Backend)

A parte do servidor é construída com Node.js e Express, localizada na pasta `server`. A estrutura de diretórios é a seguinte:

- **config/**: Configurações do servidor.
  - `db.js`: Configura a conexão com o banco de dados.

- **controllers/**: Controladores para gerenciar operações.
  - `goalController.js`: Funções para gerenciar operações relacionadas às metas.
  - `userController.js`: Funções para gerenciar operações relacionadas aos usuários.

- **middleware/**: Middleware para autenticação.
  - `authMiddleware.js`: Middleware para autenticação de usuários.

- **models/**: Modelos de dados.
  - `goalModel.js`: Define o modelo de dados para as metas.
  - `userModel.js`: Define o modelo de dados para os usuários.

- **routes/**: Rotas da aplicação.
  - `goalRoutes.js`: Rotas relacionadas às metas.
  - `userRoutes.js`: Rotas relacionadas aos usuários.

- `server.js`: Ponto de entrada do servidor, onde a aplicação Express é configurada.

- `package.json`: Configuração do npm para o servidor.

## Como Executar o Projeto

1. Clone o repositório.
2. Navegue até a pasta `client` e execute `npm install` para instalar as dependências do frontend.
3. Navegue até a pasta `server` e execute `npm install` para instalar as dependências do backend.
4. Configure o banco de dados no arquivo `server/config/db.js`.
5. Inicie o servidor com `node server.js`.
6. Inicie o cliente com `npm start` na pasta `client`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License.