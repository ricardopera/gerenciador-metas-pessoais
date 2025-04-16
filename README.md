# Gerenciador de Metas Pessoais

Este projeto é um aplicativo de gerenciamento de metas pessoais desenvolvido utilizando a stack MERN (MongoDB, Express, React e Node.js) com interface visual moderna implementada em Material UI. O objetivo do aplicativo é permitir que os usuários criem, visualizem e gerenciem suas metas de forma eficiente em um ambiente visualmente agradável e responsivo.

## Características Principais

- **Interface Moderna**: Design moderno e responsivo implementado com Material UI 7
- **Autenticação de Usuários**: Sistema completo de registro e login
- **Gestão de Metas**: Criação, edição e exclusão de metas pessoais
- **Categorização**: Organização de metas por prioridade (Alta, Média, Baixa)
- **Prazos**: Definição de datas limite para conclusão de metas
- **Filtros e Ordenação**: Visualize suas metas filtradas por status e ordenadas por diferentes critérios
- **Dashboard**: Acompanhe seu progresso através de um dashboard visual
- **Design Responsivo**: Experiência otimizada em dispositivos móveis, tablets e desktops
- **Animações Suaves**: Transições e efeitos visuais implementados com Framer Motion

## Tecnologias Utilizadas

### Frontend (Cliente)
- React 18
- Material UI 7
- Framer Motion (para animações)
- React Router (para navegação)
- Context API (para gerenciamento de estado)
- Axios (para requisições HTTP)
- Date-fns (para manipulação de datas)

### Backend (Servidor)
- Node.js
- Express
- MongoDB (com Mongoose)
- JWT (para autenticação)
- Bcrypt (para criptografia de senhas)
- Jest (para testes)

## Estrutura do Projeto

O projeto é dividido em duas partes principais: o cliente (frontend) e o servidor (backend).

### Cliente (Frontend)

- **`client/src/App.jsx`**: Configuração do tema e providers da aplicação React.
- **`client/src/AppRoutes.jsx`**: Gerenciamento de rotas com react-router.
- **`client/src/components/Layout/Layout.jsx`**: Layout principal da aplicação com header, navegação e footer.
- **`client/src/components/Layout/Header.jsx`**: Cabeçalho responsivo com navegação móvel.
- **`client/src/components/Layout/Navigation.jsx`**: Navegação em formato de abas adaptada para dispositivos.
- **`client/src/components/Dashboard.jsx`**: Visão geral das metas do usuário.
- **`client/src/components/Goals/GoalForm.jsx`**: Formulário interativo para criar e editar metas.
- **`client/src/components/Goals/GoalItem.jsx`**: Cartão de meta com indicadores visuais de prioridade e prazo.
- **`client/src/components/Goals/GoalList.jsx`**: Lista de metas com filtros e ordenação.
- **`client/src/components/Auth/Login.jsx`**: Tela de login moderna com validações.
- **`client/src/components/Auth/Register.jsx`**: Formulário de registro com feedback visual.
- **`client/src/pages/HomePage.jsx`**: Página inicial com apresentação visual e animações.
- **`client/src/pages/GoalsPage.jsx`**: Exibe as metas do usuário e o formulário de adição.
- **`client/src/pages/ProfilePage.jsx`**: Gerenciamento de informações do usuário.
- **`client/src/context/AuthContext.jsx`**: Gerencia o estado de autenticação do usuário.
- **`client/src/context/GoalContext.jsx`**: Gerencia o estado das metas do usuário.
- **`client/src/services/api.js`**: Funções para interagir com a API do servidor.

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
- **`server/tests/`**: Testes automatizados para a aplicação.

## Configuração do Projeto

Para configurar o projeto, siga os passos abaixo:

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/gerenciador-metas-pessoais.git
   cd gerenciador-metas-pessoais
   ```

2. Navegue até a pasta do servidor e instale as dependências:
   ```
   cd server
   npm install
   ```

3. Configure as variáveis de ambiente no servidor:
   - Crie um arquivo `.env` na pasta do servidor com:
   ```
   PORT=5000
   MONGO_URI=sua_uri_do_mongodb
   JWT_SECRET=seu_segredo_jwt
   ```

4. Inicie o servidor:
   ```
   npm start
   ```

5. Em outro terminal, navegue até a pasta do cliente e instale as dependências:
   ```
   cd client
   npm install
   ```

6. Inicie o cliente:
   ```
   npm start
   ```

7. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Screenshots

(Adicionar screenshots da aplicação)

## Recursos Futuros

- Notificações para metas próximas da data limite
- Categorização avançada com tags personalizadas
- Compartilhamento de metas com outros usuários
- Temas de cores personalizáveis
- Modo escuro
- Calendário para visualização de metas
- Versão para dispositivos móveis (React Native)

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie um branch para sua feature: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adicionando nova feature'`
4. Push para o branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License.

## Autor

Ricardo (ricardopera) - [GitHub](https://github.com/ricardopera)