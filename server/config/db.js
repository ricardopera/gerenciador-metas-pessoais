const mongoose = require('mongoose');

// Armazena a conexão para evitar múltiplas instâncias
let dbConnection = null;

const connectDB = async () => {
    // Se já existe uma conexão, retorna a conexão existente
    if (dbConnection) {
        return dbConnection;
    }

    try {
        // Usando a string de conexão apropriada baseada no ambiente
        let mongoURI = process.env.MONGODB_URI;
        
        // Se estiver em ambiente de teste, usa a URI de teste ou a mesma URI de produção
        if (process.env.NODE_ENV === 'test') {
            mongoURI = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
        }
        
        dbConnection = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Cluster conectado com sucesso (${process.env.NODE_ENV === 'test' ? 'TESTE' : 'PRODUÇÃO'})`);
        return dbConnection;
    } catch (error) {
        console.error('Falha na conexão com o MongoDB Cluster:', error.message);
        // Não encerramos o processo se estiver em ambiente de teste
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
        throw error; // Para testes, propagamos o erro em vez de encerrar o processo
    }
};

// Função para desconectar do banco em testes
const disconnectDB = async () => {
    if (mongoose.connection.readyState) {
        await mongoose.connection.close();
        dbConnection = null;
        console.log('Desconectado do MongoDB');
    }
};

module.exports = { connectDB, disconnectDB };