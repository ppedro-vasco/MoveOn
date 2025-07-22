// src/pages/UserPage.tsx
import React from 'react';
// import { useAuth } from '../context/AuthContext'; // Se precisar de dados do usuário aqui

const UserPage: React.FC = () => {
    // const { user } = useAuth(); // Exemplo de como acessar o usuário

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard do Usuário</h1>
            <p className="text-gray-600">
                Bem-vindo à sua área pessoal. Acompanhe seu progresso e explore os recursos.
            </p>
            {/* Adicione o conteúdo específico da dashboard do usuário aqui */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-yellow-800">Minhas Atividades</h2>
                    <p className="text-yellow-600 mt-2">Veja seu histórico de atividades e metas.</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-red-800">Minhas Receitas Favoritas</h2>
                    <p className="text-red-600 mt-2">Acesse suas receitas salvas e personalize seu cardápio.</p>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
