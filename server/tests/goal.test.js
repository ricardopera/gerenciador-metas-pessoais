const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { connectDB, disconnectDB } = require('../config/db');

// Mock para o JWT
jest.mock('jsonwebtoken');

describe('Rotas de Metas', () => {
  // ID de usuário para testes
  const testUserId = new mongoose.Types.ObjectId();

  // Conectar ao banco de dados de teste antes de executar os testes
  beforeAll(async () => {
    await connectDB();

    // Criar um usuário para os testes
    await new User({
      _id: testUserId,
      username: 'usuario_teste',
      name: 'Usuário Teste',
      email: 'teste@exemplo.com',
      password: 'senha123'
    }).save();

    // Mock para o middleware de autenticação
    jwt.verify.mockReturnValue({ id: testUserId });
  });

  // Limpar todos os dados após cada teste
  afterEach(async () => {
    await Goal.deleteMany({});
  });

  // Desconectar do banco de dados após os testes
  afterAll(async () => {
    await User.deleteMany({});
    await disconnectDB();
  });

  // Teste para criar uma nova meta
  describe('POST /api/goals', () => {
    it('deve criar uma nova meta com sucesso', async () => {
      const goalData = {
        title: 'Meta de Teste',
        description: 'Descrição da meta de teste',
        deadline: new Date('2026-01-01'),
        priority: 'Alta',
        status: 'Em andamento',
        userId: testUserId
      };

      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', 'Bearer fake-token')
        .send(goalData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('title', goalData.title);
      expect(res.body).toHaveProperty('description', goalData.description);
      expect(res.body).toHaveProperty('completed', false);

      // Verificar se a meta foi realmente criada no banco de dados
      const goal = await Goal.findById(res.body._id);
      expect(goal).not.toBeNull();
    });

    it('deve retornar erro 401 ao tentar criar meta sem autenticação', async () => {
      const goalData = {
        title: 'Meta Não Autorizada',
        description: 'Esta meta não deve ser criada',
        deadline: new Date('2026-01-01'),
        priority: 'Alta',
        status: 'Em andamento',
        userId: testUserId
      };

      const res = await request(app)
        .post('/api/goals')
        .send(goalData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Acesso negado. Token não fornecido.');

      // Verificar que nenhuma meta foi criada
      const goalsCount = await Goal.countDocuments();
      expect(goalsCount).toBe(0);
    });

    it('deve retornar erro 400 ao tentar criar meta com dados inválidos', async () => {
      // Dados incompletos - sem título
      const invalidGoalData = {
        description: 'Descrição sem título',
        userId: testUserId
      };

      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', 'Bearer fake-token')
        .send(invalidGoalData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });

  // Teste para listar todas as metas
  describe('GET /api/goals', () => {
    it('deve listar todas as metas do usuário', async () => {
      // Criar algumas metas para o teste
      const goalData = [
        {
          title: 'Meta 1',
          description: 'Descrição da meta 1',
          deadline: new Date('2026-01-01'),
          priority: 'Alta',
          status: 'Em andamento',
          userId: testUserId
        },
        {
          title: 'Meta 2',
          description: 'Descrição da meta 2',
          deadline: new Date('2026-02-01'),
          priority: 'Média',
          status: 'Não iniciada',
          userId: testUserId
        }
      ];

      await Goal.insertMany(goalData);

      const res = await request(app)
        .get('/api/goals')
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[1]).toHaveProperty('title');
    });

    it('deve retornar uma lista vazia se não houver metas', async () => {
      const res = await request(app)
        .get('/api/goals')
        .set('Authorization', 'Bearer fake-token')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it('deve retornar erro 401 ao tentar listar metas sem autenticação', async () => {
      const res = await request(app)
        .get('/api/goals')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body).toHaveProperty('message', 'Acesso negado. Token não fornecido.');
    });
  });
});