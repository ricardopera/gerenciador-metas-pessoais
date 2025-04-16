const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Configuração do CORS para ambiente Azure
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? '*' // Em produção, aceita requisições de qualquer origem (pode ser ajustado para domínios específicos)
    : 'http://localhost:3000', // Em desenvolvimento, aceita apenas localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint para o Azure
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor funcionando corretamente' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);

// Servir arquivos estáticos do React em produção
if (process.env.NODE_ENV === 'production') {
  // Definir pasta de arquivos estáticos
  const staticPath = path.join(__dirname, '../client/build');
  app.use(express.static(staticPath));

  // Todas as rotas não definidas direcionam para o index.html do React
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(staticPath, 'index.html'));
    }
  });
}

// Database connection
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      console.log('Conectado ao MongoDB');
      // Start server apenas se conectado ao banco de dados
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Falha ao conectar ao MongoDB:', err.message);
    });
} else {
  // Para testes, apenas exporta o app sem iniciar o servidor
  console.log('Ambiente de teste detectado, não iniciando o servidor');
}

// Export app for testing
module.exports = app;