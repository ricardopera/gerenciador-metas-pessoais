const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Função para gerar um token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_key', {
        expiresIn: '30d' // Token expira em 30 dias
    });
};

// Função para registrar um novo usuário
exports.registerUser = async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        const newUser = new User({ username, name, email, password });
        await newUser.save();
        
        // Gerar token e retornar dados com o token
        const token = generateToken(newUser._id);
        
        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: {
                _id: newUser._id,
                username: newUser.username,
                name: newUser.name,
                email: newUser.email,
                token
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar usuário', error });
    }
};

// Função para fazer login do usuário
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        
        // Gerar token
        const token = generateToken(user._id);
        
        res.status(200).json({
            message: 'Login bem-sucedido',
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
};

// Função para obter informações do usuário
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter perfil do usuário', error });
    }
};