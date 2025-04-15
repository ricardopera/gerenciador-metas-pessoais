# Gerenciador de Metas Pessoais

Este projeto é um aplicativo de gerenciamento de metas pessoais desenvolvido utilizando a stack MERN (MongoDB, Express, React e Node.js). O objetivo do aplicativo é permitir que os usuários criem, visualizem e gerenciem suas metas de forma eficiente.

## Estrutura do Projeto

O projeto é dividido em duas partes principais: o cliente (frontend) e o servidor (backend).

### Cliente (Frontend)

- **`client/public/index.html`**: Ponto de entrada da aplicação React.
- **`client/public/manifest.json`**: Configurações do manifesto da aplicação.
- **`client/src/components/Dashboard.jsx`**: Componente que exibe uma visão geral das metas do usuário.
- **`client/src/components/Goals/GoalForm.jsx`**: Componente para criar novas metas.
- **`client/src/components/Goals/GoalItem.jsx`**: Representa uma única meta na lista.
- **`client/src/components/Goals/GoalList.jsx`**: Renderiza uma lista de metas.
- **`client/src/components/Layout/Header.jsx`**: Exibe o cabeçalho da aplicação.
- **`client/src/components/Layout/Navigation.jsx`**: Fornece links de navegação na aplicação.
- **`client/src/components/Auth/Login.jsx`**: Permite ao usuário fazer login.
- **`client/src/components/Auth/Register.jsx`**: Permite ao usuário se registrar.
- **`client/src/pages/HomePage.jsx`**: Representa a página inicial da aplicação.
- **`client/src/pages/GoalsPage.jsx`**: Exibe as metas do usuário.
- **`client/src/pages/ProfilePage.jsx`**: Exibe as informações do perfil do usuário.
- **`client/src/context/AuthContext.jsx`**: Gerencia o estado de autenticação do usuário.
- **`client/src/context/GoalContext.jsx`**: Gerencia o estado das metas do usuário.
- **`client/src/services/api.js`**: Funções para interagir com a API do servidor.
- **`client/src/App.jsx`**: Componente principal da aplicação.
- **`client/src/index.js`**: Ponto de entrada da aplicação React.
- **`client/package.json`**: Configuração do npm para o cliente.
- **`client/README.md`**: Documentação do cliente.

### Servidor (Backend)

- **`server/config/db.js`**: Configuração da conexão com o banco de dados.
- **`server/controllers/goalController.js`**: Funções para gerenciar operações relacionadas às metas.
- **`server/controllers/userController.js`**: Funções para gerenciar operações relacionadas aos usuários.
- **`server/middleware/authMiddleware.js`**: Middleware para autenticação de usuários.
- **`server/models/goalModel.js`**: Modelo de dados para as metas.
- **`server/models/userModel.js`**: Modelo de dados para os usuários.
- **`server/routes/goalRoutes.js`**: Rotas relacionadas às metas.
- **`server/routes/userRoutes.js`**: Rotas relacionadas aos usuários.
- **`server/server.js`**: Ponto de entrada do servidor.
- **`server/package.json`**: Configuração do npm para o servidor.

### Configuração do Projeto

Para configurar o projeto, siga os passos abaixo:

1. Clone o repositório.
2. Navegue até a pasta do cliente e instale as dependências:
   ```
   cd client
   npm install
   ```
3. Navegue até a pasta do servidor e instale as dependências:
   ```
   cd server
   npm install
   ```
4. Configure o banco de dados no arquivo `server/config/db.js`.
5. Inicie o servidor:
   ```
   cd server
   node server.js
   ```
6. Inicie o cliente:
   ```
   cd client
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License.