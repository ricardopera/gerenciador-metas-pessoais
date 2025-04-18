const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.log('Erro ao verificar token:', error);
        res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = { protect };