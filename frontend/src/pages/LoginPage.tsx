// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { useNavigate } from 'react-router-dom';
import { LogIn, Box } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, error: authError, loading: authLoading, user } = useAuth(); // Obtém o 'user' do contexto
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    // Efeito para redirecionar se o usuário já estiver logado
    useEffect(() => {
        if (user && !authLoading) {
            let redirectPath = "/"; // Default para usuários logados
            if (user.user_type === 'admin') {
                redirectPath = "/admin";
            } else if (user.user_type === 'user') {
                redirectPath = "/user";
            }
            navigate(redirectPath, { replace: true });
        }
    }, [user, authLoading, navigate]); // Dependências: user, authLoading, navigate

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        // A função login no AuthContext já lida com o estado de loading e erros da API
        const success = await login(username, password);

        if (success) {
            console.log('Login bem-sucedido na LoginPage! Redirecionando...');
            // O redirecionamento será tratado pelo useEffect acima,
            // que reage à mudança do estado 'user' no contexto.
        } else {
            console.log('Login falhou na LoginPage. Verifique a mensagem de erro acima.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <LogIn className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao Move On</h1>
                    <p className="text-gray-600 mt-2">Entre com sua conta corporativa</p>
                </div>

                {/* Exibe erro local ou erro do contexto de autenticação */}
                {(localError || authError) && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{localError || authError}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuário:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        disabled={authLoading}
                    >
                        {authLoading ? 'Entrando...' : 'Entrar'}
                        {!authLoading && <LogIn className="w-5 h-5 ml-2" />}
                    </button>
                </form>

                <button
                    onClick={() => console.log('Login com Microsoft (a ser implementado)')}
                    className="w-full flex items-center justify-center space-x-2 bg-[#2F2F2F] text-white px-4 py-3 rounded-lg hover:bg-[#1F1F1F] transition-colors mt-4"
                >
                    <Box className="w-5 h-5" />
                    <span>Entrar com Microsoft (WIP)</span>
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Use sua conta corporativa para acessar a plataforma.</p>
                    <p className="mt-2">Em caso de problemas, contate o suporte de TI.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
