# Funcionalidades do Gerenciador de Metas Pessoais

## Visão Geral

O Gerenciador de Metas Pessoais é uma aplicação completa desenvolvida com a stack MERN (MongoDB, Express, React e Node.js) que permite aos usuários definir, acompanhar e gerenciar suas metas pessoais de forma organizada e eficiente. A aplicação oferece interface amigável, recursos de filtragem, estatísticas de progresso e gerenciamento completo do perfil do usuário.

## Funcionalidades para Usuários Não Autenticados

### Página Inicial
- **Apresentação do produto**: Exibição da proposta de valor e principais recursos do aplicativo
- **Botões de chamada para ação**: Opções para login ou registro de novos usuários
- **Recursos destacados**: Seção que apresenta os principais recursos da plataforma

### Autenticação
- **Registro de usuário**: Formulário para criação de nova conta com validação de dados
- **Login**: Sistema de autenticação seguro com JWT (JSON Web Token)
- **Redirecionamentos inteligentes**: Após login/registro, usuários são direcionados ao dashboard

## Funcionalidades para Usuários Autenticados

### Dashboard
- **Resumo de metas**: Visão geral das metas do usuário
- **Estatísticas em tempo real**:
  - Total de metas cadastradas
  - Número de metas concluídas
  - Número de metas em andamento
  - Taxa de conclusão em porcentagem
- **Acesso rápido às metas recentes**: Exibição das 3 metas mais recentes
- **Navegação intuitiva**: Links diretos para todas as seções do aplicativo

### Gerenciamento de Metas

#### Criação de Metas
- **Formulário intuitivo** para adicionar novas metas com os seguintes campos:
  - Título (obrigatório)
  - Descrição detalhada (obrigatório)
  - Data limite (opcional)
  - Prioridade (Baixa, Média, Alta)
- **Feedback visual**: Mensagens de sucesso ou erro após submissão do formulário
- **Validação de dados**: Garantia de que todos os campos obrigatórios sejam preenchidos

#### Listagem de Metas
- **Visualização completa**: Lista de todas as metas do usuário
- **Sistema de filtragem**:
  - Por status (Todas, Pendentes, Concluídas)
  - Por prioridade
  - Por data limite
  - Por ordem alfabética
- **Ordenação personalizável**: Múltiplas opções de ordenação (mais recentes, data limite, prioridade, alfabética)
- **Interface responsiva**: Adaptação a diferentes tamanhos de tela

#### Detalhes e Ações em Metas
- **Visualização detalhada**: Expansão de cada meta para ver todos os detalhes
- **Marcação de conclusão**: Checkbox para marcar/desmarcar uma meta como concluída
- **Indicadores visuais**: Cores e ícones diferentes para metas concluídas e por prioridade
- **Exclusão de metas**: Opção para remover metas com confirmação prévia
- **Edição de metas**: Funcionalidade para atualizar qualquer informação da meta

### Perfil de Usuário

#### Visualização de Perfil
- **Informações pessoais**: Exibição de dados do usuário (nome, username, email)
- **Estatísticas personalizadas**:
  - Metas criadas
  - Metas concluídas
  - Metas pendentes
  - Taxa de conclusão geral

#### Edição de Perfil
- **Atualização de dados pessoais**:
  - Nome completo
  - Nome de usuário
  - Email
- **Alteração de senha**:
  - Campo para senha atual (verificação de segurança)
  - Campo para nova senha
  - Confirmação de nova senha
  - Validação de correspondência das senhas
- **Feedback instantâneo**: Mensagens de sucesso ou erro após tentativas de atualização

#### Segurança da Conta
- **Gerenciamento de conta**: Opção para exclusão permanente da conta
- **Medidas de segurança**: Confirmação antes de ações irreversíveis
- **Encerramento de sessão**: Opção de logout com redirecionamento para a página inicial

## Recursos Técnicos

### Segurança
- **Autenticação JWT**: Tokens de acesso seguros para proteção de rotas
- **Proteção de rotas**: Acesso restrito a páginas que requerem autenticação
- **Criptografia de senhas**: Armazenamento seguro de credenciais
- **Interceptores de requisição**: Inclusão automática do token em cabeçalhos HTTP

### Interface de Usuário
- **Design responsivo**: Adaptação a dispositivos desktop, tablet e mobile
- **Feedback visual**: Indicadores de carregamento e status de operações
- **Consistência visual**: Sistema de cores e estilos uniforme em toda a aplicação
- **Navegação intuitiva**: Menu principal com acesso a todas as seções

### Performance e Usabilidade
- **Carregamento otimizado**: Minimização de requisições ao servidor
- **Validação em tempo real**: Feedback imediato durante preenchimento de formulários
- **Mensagens contextuais**: Alertas e informações relevantes ao contexto do usuário
- **Estado persistente**: Manutenção do estado de autenticação entre sessões

## Benefícios para o Usuário

- **Organização pessoal**: Centralização de todas as metas e objetivos em um só lugar
- **Motivação**: Visualização clara do progresso e conquistas
- **Priorização**: Classificação e ordenação de metas por importância e urgência
- **Acompanhamento**: Monitoramento constante do andamento das metas pessoais
- **Acessibilidade**: Disponibilidade das informações em qualquer dispositivo com acesso à internet

---

*Este documento descreve as funcionalidades atuais do sistema. Novas funcionalidades podem ser adicionadas em versões futuras do aplicativo.*