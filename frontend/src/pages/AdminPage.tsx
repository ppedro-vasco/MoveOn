// src/pages/AdminPage.tsx
import React from 'react';
// import { useAuth } from '../context/AuthContext'; // Se precisar de dados do usuário aqui

const AdminPage: React.FC = () => {
    // const { user } = useAuth(); // Exemplo de como acessar o usuário

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard do Administrador</h1>
            <p className="text-gray-600">
                Bem-vindo à área de administração. Aqui você terá acesso a funcionalidades exclusivas.
            </p>
            {/* Adicione o conteúdo específico da dashboard do administrador aqui */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-blue-800">Gerenciar Usuários</h2>
                    <p className="text-blue-600 mt-2">Acesse a lista de usuários e suas permissões.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-green-800">Relatórios de Saúde</h2>
                    <p className="text-green-600 mt-2">Visualize dados de saúde agregados.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-purple-800">Configurações do Sistema</h2>
                    <p className="text-purple-600 mt-2">Ajuste as configurações gerais da plataforma.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
