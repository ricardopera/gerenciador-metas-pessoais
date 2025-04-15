import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const { register, user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirecionar se já estiver logado
    if (user) {
        return <Redirect to="/dashboard" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validar se as senhas conferem
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não conferem.');
            setLoading(false);
            return;
        }

        try {
            // Remover confirmPassword antes de enviar
            const { confirmPassword, ...userData } = formData;
            await register(userData);
            // O redirecionamento é feito no contexto de autenticação
        } catch (err) {
            console.error('Erro no registro:', err);
            setError('Falha ao registrar. Este email ou username já pode estar em uso.');
            setLoading(false);
        }
    };

    return (
        <div className="container auth-container">
            <div className="auth-form-container">
                <h2>Criar Conta</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nome de usuário</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Escolha um nome de usuário"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="name">Nome completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Digite seu nome completo"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Digite seu email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="Crie uma senha (min. 6 caracteres)"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirme a senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                            placeholder="Confirme sua senha"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
                
                <div className="auth-links">
                    <p>
                        Já tem uma conta? <Link to="/login">Faça login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;