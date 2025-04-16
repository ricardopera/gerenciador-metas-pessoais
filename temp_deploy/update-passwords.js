const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

async function updatePasswords() {
  try {
    // Conectar ao banco de dados
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');
    
    // Buscar todos os usuários
    const users = await User.find({});
    
    for (const user of users) {
      // Verificar se a senha parece estar em texto simples (não começa com $2a$ ou $2b$)
      if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        const plainPassword = user.password;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(plainPassword, salt);
        await user.save();
        console.log(`Senha atualizada para o usuário: ${user.username}`);
      }
    }
    
    console.log('Todas as senhas foram atualizadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao atualizar senhas:', error);
    process.exit(1);
  }
}

updatePasswords();