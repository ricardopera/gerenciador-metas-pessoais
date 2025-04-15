import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const { login, user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirecionar se já estiver logado
    if (user) {
        return <Redirect to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ email, password });
            // O redirecionamento é feito no contexto de autenticação
        } catch (err) {
            console.error('Erro de login:', err);
            setError('Falha ao fazer login. Verifique suas credenciais.');
            setLoading(false);
        }
    };

    return (
        <div className="container auth-container">
            <div className="auth-form-container">
                <h2>Login</h2>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Seu email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Sua senha"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
                
                <div className="auth-links">
                    <p>
                        Não tem uma conta? <Link to="/register">Registre-se</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;