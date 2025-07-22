// src/components/UserForm.tsx
import React, { useState, useEffect } from 'react';

// Interfaces para tipagem
interface UserFormData {
    name: string;
    username: string;
    password?: string; // Senha é opcional para edição
    type: 'user' | 'admin';
    registro?: string; // Opcional para admin
    cpf?: string;       // Opcional para user
}

interface UserFormProps {
    userToEdit: UserFormData | null;
    onSubmit: (formData: UserFormData) => Promise<void>; // Retorna Promise<void> para async
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        username: '',
        password: '',
        type: 'user', // Default para 'user'
        registro: '',
        cpf: ''
    });
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (userToEdit) {
            // Se estamos editando, preenche o formulário com os dados do usuário
            setFormData({
                name: userToEdit.name || '',
                username: userToEdit.username || '',
                password: '', // Senha não deve ser preenchida para edição por segurança
                type: userToEdit.type || 'user',
                registro: userToEdit.registro || '',
                cpf: userToEdit.cpf || ''
            });
        } else {
            // Se estamos adicionando, reseta o formulário
            setFormData({
                name: '',
                username: '',
                password: '',
                type: 'user',
                registro: '',
                cpf: ''
            });
        }
        setFormError(null); // Limpa erros ao mudar de modo
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            type: value as 'user' | 'admin', // Garante que o tipo é 'user' ou 'admin'
            registro: value === 'user' ? prev.registro : '', // Limpa registro se for admin
            cpf: value === 'admin' ? prev.cpf : ''           // Limpa cpf se for user
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validação básica do formulário
        if (!formData.name || !formData.username) {
            setFormError('Nome e Usuário são campos obrigatórios.');
            return;
        }
        if (!userToEdit && !formData.password) { // Senha é obrigatória apenas ao adicionar
            setFormError('Senha é obrigatória para novos usuários.');
            return;
        }
        if (formData.type === 'user' && !formData.registro) {
            setFormError('Registro é obrigatório para usuários comuns.');
            return;
        }
        if (formData.type === 'admin' && !formData.cpf) {
            setFormError('CPF é obrigatório para administradores.');
            return;
        }

        // Prepara os dados para envio (remove campos vazios ou não aplicáveis)
        const dataToSend: UserFormData = { ...formData };
        if (dataToSend.type === 'user') {
            delete dataToSend.cpf;
        } else {
            delete dataToSend.registro;
        }
        if (!dataToSend.password) { // Não envia senha vazia ao editar
            delete dataToSend.password;
        }

        await onSubmit(dataToSend); // Chama a função onSubmit passada via props
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {userToEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
            </h3>
            {formError && (
                <p className="text-red-600 text-sm mb-4">{formError}</p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuário:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={userToEdit ? 'Deixe em branco para manter a senha atual' : ''}
                        required={!userToEdit} // Senha é obrigatória apenas ao adicionar
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
                    <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleTypeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                    >
                        <option value="user">Usuário Comum</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                {formData.type === 'user' && (
                    <div>
                        <label htmlFor="registro" className="block text-sm font-medium text-gray-700 mb-1">Registro:</label>
                        <input
                            type="text"
                            name="registro"
                            id="registro"
                            value={formData.registro}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                )}
                {formData.type === 'admin' && (
                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF:</label>
                        <input
                            type="text"
                            name="cpf"
                            id="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                )}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        {userToEdit ? 'Salvar Alterações' : 'Adicionar Usuário'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
