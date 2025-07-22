// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

// Interface User atualizada para refletir APENAS os campos retornados pelo login
interface User {
    id: string; // user_id do backend
    username: string;
    name: string;
    user_type: 'admin' | 'user'; // 'type' do backend
    // Campos como cpf, registro, email, department, avatar NÃO são retornados pelo login
    // Se precisar deles, eles devem ser opcionais ou buscados em outra requisição
    cpf?: string;
    registro?: string;
    email?: string;
    department?: string;
    avatar?: string;
}

// Interface LoginResponse para o que o backend retorna no /api/auth/login
interface LoginResponse {
    message: string;
    user_id: string;
    username: string;
    name: string;
    user_type: 'admin' | 'user'; // 'type' do backend
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser: User = JSON.parse(storedUser);
                // Validação básica para garantir que o user_type é válido
                if (parsedUser.user_type === 'admin' || parsedUser.user_type === 'user') {
                    setUser(parsedUser);
                } else {
                    console.warn("Tipo de usuário inválido no localStorage. Removendo usuário.");
                    localStorage.removeItem('user');
                }
            } catch (e) {
                console.error("Erro ao carregar usuário do localStorage:", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await auth.login(username, password);
            const data = response.data as LoginResponse; // Resposta direta do backend

            // Verifica se os campos essenciais para a interface User estão presentes
            // Note que 'type' do backend é 'user_type' no frontend
            if (data && data.user_id && data.username && data.name && (data.user_type === 'admin' || data.user_type === 'user')) {
                const loggedInUser: User = {
                    id: data.user_id,
                    username: data.username,
                    name: data.name,
                    user_type: data.user_type, // Mapeia 'type' do backend para 'user_type'
                    // Outros campos como cpf, registro, email, department, avatar
                    // não vêm diretamente do login, então não os inclua aqui
                    // ou defina-os como undefined/null.
                    // Se precisar deles, você pode buscá-los em outra requisição
                    // ou modificar seu backend para incluí-los no login.
                };

                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                return true;
            } else {
                setError("Resposta inesperada do servidor. Dados de usuário incompletos ou tipo de usuário inválido.");
                return false;
            }
        } catch (err: any) {
            console.error("Erro no login:", err);
            const errorMessage = err.response?.data?.message || "Erro ao conectar com o servidor. Credenciais inválidas.";
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
