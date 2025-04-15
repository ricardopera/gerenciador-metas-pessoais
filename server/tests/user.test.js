const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { connectDB, disconnectDB } = require('../config/db');

// Mock para o JWT
jest.mock('jsonwebtoken');

describe('Rotas de Usuário', () => {
  // Conectar ao banco de dados de teste antes de executar os testes
  beforeAll(async () => {
    await connectDB();
  });

  // Limpar todos os dados após os testes
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Desconectar do banco de dados após os testes
  afterAll(async () => {
    await disconnectDB();
  });

  // Teste para registrar um novo usuário
  describe('POST /api/users/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const userData = {
        username: 'usuario_teste',
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        password: 'senha123'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Usuário registrado com sucesso!');
    });

    it('deve retornar erro ao tentar registrar usuário com email já existente', async () => {
      // Primeiro cria um usuário
      const userData = {
        username: 'usuario_existente',
        name: 'Usuário Existente',
        email: 'existente@exemplo.com',
        password: 'senha123'
      };

      await new User(userData).save();

      // Tenta criar outro usuário com o mesmo email
      const res = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('message', 'Erro ao registrar usuário');
    });
  });

  // Teste para fazer login
  describe('POST /api/users/login', () => {
    it('deve fazer login com sucesso e retornar dados do usuário', async () => {
      // Primeiro registra um usuário para o teste
      const userData = {
        username: 'usuario_login',
        name: 'Usuário Login',
        email: 'login@exemplo.com',
        password: 'senha123'
      };

      const user = new User(userData);
      await user.save();

      // Mock para o método comparePassword
      User.prototype.comparePassword = jest.fn().mockResolvedValue(true);

      const loginData = {
        email: 'login@exemplo.com',
        password: 'senha123'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Login bem-sucedido');
      expect(res.body).toHaveProperty('user');
    });

    it('deve retornar erro para credenciais inválidas', async () => {
      // Primeiro registra um usuário para o teste
      const userData = {
        username: 'usuario_invalido',
        name: 'Usuário Inválido',
        email: 'invalido@exemplo.com',
        password: 'senha123'
      };

      const user = new User(userData);
      await user.save();

      // Mock para o método comparePassword retornando false
      User.prototype.comparePassword = jest.fn().mockResolvedValue(false);

      const loginData = {
        email: 'invalido@exemplo.com',
        password: 'senhaerrada'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
    });
  });

  // Teste para obter o perfil do usuário
  describe('GET /api/users/profile', () => {
    it('deve retornar o perfil do usuário autenticado', async () => {
      // Primeiro cria um usuário para o teste
      const userData = {
        username: 'usuario_perfil',
        name: 'Perfil Teste',
        email: 'perfil@exemplo.com',
        password: 'senha123',
        _id: new mongoose.Types.ObjectId()
      };

      const user = new User(userData);
      await user.save();

      // Mock para o middleware de autenticação
      jwt.verify.mockReturnValue({ id: userData._id });

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('username', userData.username);
      expect(res.body).toHaveProperty('email', userData.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('deve retornar erro 401 sem token de autenticação', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Acesso negado. Token não fornecido.');
    });
  });
});