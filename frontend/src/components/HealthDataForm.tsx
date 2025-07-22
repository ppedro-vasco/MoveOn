// src/components/HealthDataForm.tsx
import React, { useState, useEffect } from 'react';

// Interface para um usuário simplificado (apenas o que é necessário para o select)
interface UserForSelect {
    id: string;
    name: string;
    registro?: string;
    cpf?: string;
    type: 'user' | 'admin';
}

// Interface para os dados de saúde
interface HealthRecordData {
    user_id: string;
    data_exame: string; // YYYY-MM-DD
    Glicemia: number | null;
    'Hemoglobina Glicada': number | null;
    Triglicérides: number | null;
    'Colesterol LDL': number | null;
    Ferritina: number | null;
    TSH: number | null;
    Homocisteína: number | null;
    'Gama GT': number | null;
    Creatina: number | null;
    'Vitamina B12': number | null;
    'Vitamina D': number | null;
    'Doenças Crônicas Pré-existentes': string;
    'Pressão Arterial Sistólica': number | null;
    'Pressão Arterial Diastólica': number | null;
    'IMC_valor': number | null;
    'Circunferência Abdominal': number | null;
    'Atividade Física': string;
    'Tabagista': string;
    'Sono': number | null;
    gender: string;
}

interface HealthDataFormProps {
    healthRecordToEdit: HealthRecordData | null;
    onSubmit: (formData: HealthRecordData) => Promise<void>;
    onCancel: () => void;
    usersList: UserForSelect[]; // Lista de usuários para o select
}

const HealthDataForm: React.FC<HealthDataFormProps> = ({ healthRecordToEdit, onSubmit, onCancel, usersList }) => {
    const [formData, setFormData] = useState<HealthRecordData>({
        user_id: '',
        data_exame: '',
        Glicemia: null,
        'Hemoglobina Glicada': null,
        Triglicérides: null,
        'Colesterol LDL': null,
        Ferritina: null,
        TSH: null,
        Homocisteína: null,
        'Gama GT': null,
        Creatina: null,
        'Vitamina B12': null,
        'Vitamina D': null,
        'Doenças Crônicas Pré-existentes': 'Nenhuma',
        'Pressão Arterial Sistólica': null,
        'Pressão Arterial Diastólica': null,
        'IMC_valor': null,
        'Circunferência Abdominal': null,
        'Atividade Física': 'Não',
        'Tabagista': 'Não',
        'Sono': null,
        gender: ''
    });
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (healthRecordToEdit) {
            setFormData({
                user_id: healthRecordToEdit.user_id || '',
                data_exame: (() => {
                    const dateValue = healthRecordToEdit.data_exame;
                    if (dateValue) {
                        const dateObj = new Date(dateValue);
                        if (!isNaN(dateObj.getTime())) {
                            return dateObj.toISOString().split('T')[0];
                        }
                    }
                    return '';
                })(),
                Glicemia: healthRecordToEdit.Glicemia ?? null,
                'Hemoglobina Glicada': healthRecordToEdit['Hemoglobina Glicada'] ?? null,
                Triglicérides: healthRecordToEdit.Triglicérides ?? null,
                'Colesterol LDL': healthRecordToEdit['Colesterol LDL'] ?? null,
                Ferritina: healthRecordToEdit.Ferritina ?? null,
                TSH: healthRecordToEdit.TSH ?? null,
                Homocisteína: healthRecordToEdit.Homocisteína ?? null,
                'Gama GT': healthRecordToEdit['Gama GT'] ?? null,
                Creatina: healthRecordToEdit.Creatina ?? null,
                'Vitamina B12': healthRecordToEdit['Vitamina B12'] ?? null,
                'Vitamina D': healthRecordToEdit['Vitamina D'] ?? null,
                'Doenças Crônicas Pré-existentes': healthRecordToEdit['Doenças Crônicas Pré-existentes'] || 'Nenhuma',
                'Pressão Arterial Sistólica': healthRecordToEdit['Pressão Arterial Sistólica'] ?? null,
                'Pressão Arterial Diastólica': healthRecordToEdit['Pressão Arterial Diastólica'] ?? null,
                'IMC_valor': healthRecordToEdit['IMC_valor'] ?? null,
                'Circunferência Abdominal': healthRecordToEdit['Circunferência Abdominal'] ?? null,
                'Atividade Física': healthRecordToEdit['Atividade Física'] || 'Não',
                'Tabagista': healthRecordToEdit.Tabagista || 'Não',
                'Sono': healthRecordToEdit.Sono ?? null,
                gender: healthRecordToEdit.gender || ''
            });
        } else {
            setFormData({
                user_id: '',
                data_exame: new Date().toISOString().split('T')[0],
                Glicemia: null,
                'Hemoglobina Glicada': null,
                Triglicérides: null,
                'Colesterol LDL': null,
                Ferritina: null,
                TSH: null,
                Homocisteína: null,
                'Gama GT': null,
                Creatina: null,
                'Vitamina B12': null,
                'Vitamina D': null,
                'Doenças Crônicas Pré-existentes': 'Nenhuma',
                'Pressão Arterial Sistólica': null,
                'Pressão Arterial Diastólica': null,
                'IMC_valor': null,
                'Circunferência Abdominal': null,
                'Atividade Física': 'Não',
                'Tabagista': 'Não',
                'Sono': null,
                gender: ''
            });
        }
        setFormError(null);
    }, [healthRecordToEdit, usersList]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'data_exame' ? value : (type === 'number' ? parseFloat(value) : value === '' ? null : value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.user_id || !formData.data_exame || !formData.gender) {
            setFormError('ID do Usuário, Data do Exame e Sexo são obrigatórios.');
            return;
        }

        const dataToSend = { ...formData };

        if (!dataToSend.data_exame || typeof dataToSend.data_exame !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataToSend.data_exame)) {
            setFormError('Formato da Data do Exame inválido. Use AAAA-MM-DD (ex: 2025-01-01).');
            return;
        }

        // Converte campos numéricos de string vazia para null ou para número
        for (const key in dataToSend) {
            // Ignora user_id e data_exame, que já são tratados
            if (key === 'data_exame' || key === 'user_id' || key === 'gender' || key === 'Doenças Crônicas Pré-existentes' || key === 'Atividade Física' || key === 'Tabagista') continue;

            const value = dataToSend[key as keyof HealthRecordData]; // Type assertion
            if (typeof value === 'string' && value.trim() === '') {
                (dataToSend as any)[key] = null; // Converte string vazia para null
            } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
                (dataToSend as any)[key] = parseFloat(value); // Converte string numérica para número
            }
        }

        await onSubmit(dataToSend);
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-4 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {healthRecordToEdit ? 'Editar Registro de Saúde' : 'Adicionar Novo Registro de Saúde'}
            </h3>
            {formError && (
                <p className="text-red-600 text-sm mb-4">{formError}</p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">Funcionário (Registro):</label>
                    <select
                        name="user_id"
                        id="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                        disabled={!!healthRecordToEdit} // Desabilita edição do user_id
                    >
                        <option value="">Selecione um Funcionário</option>
                        {usersList && usersList
                            .filter(u => u.type === 'user') // Apenas usuários comuns podem ter registros de saúde
                            .map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} (Registro: {user.registro || user.cpf})
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="data_exame" className="block text-sm font-medium text-gray-700 mb-1">Data do Exame:</label>
                    <input
                        type="date"
                        name="data_exame"
                        id="data_exame"
                        value={formData.data_exame}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Sexo:</label>
                    <select
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                    >
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Exames Laboratoriais:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Glicemia', 'Hemoglobina Glicada', 'Triglicérides', 'Colesterol LDL', 'Ferritina', 'TSH',
                        'Homocisteína', 'Gama GT', 'Creatina', 'Vitamina B12', 'Vitamina D'].map(field => (
                            <div key={field}>
                                <label htmlFor={field.replace(/\s/g, '')} className="block text-sm font-medium text-gray-700 mb-1">{field}:</label>
                                <input
                                    type="number"
                                    name={field}
                                    id={field.replace(/\s/g, '')}
                                    value={formData[field as keyof HealthRecordData] ?? ''} // Usa ?? '' para exibir 0 ou vazio
                                    onChange={handleChange}
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                                />
                            </div>
                        ))}
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Outros Indicadores:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="doencas-cronicas" className="block text-sm font-medium text-gray-700 mb-1">Doenças Crônicas Pré-existentes:</label>
                        <select
                            name="Doenças Crônicas Pré-existentes"
                            id="doencas-cronicas"
                            value={formData['Doenças Crônicas Pré-existentes']}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                        >
                            <option value="Nenhuma">Nenhuma</option>
                            <option value="Uma Doença Crônica">Uma Doença Crônica</option>
                            <option value="Duas ou Mais Doenças Crônicas">Duas ou Mais Doenças Crônicas</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="pressao-sistolica" className="block text-sm font-medium text-gray-700 mb-1">Pressão Sistólica:</label>
                        <input
                            type="number"
                            name="Pressão Arterial Sistólica"
                            id="pressao-sistolica"
                            value={formData['Pressão Arterial Sistólica'] ?? ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="pressao-diastolica" className="block text-sm font-medium text-gray-700 mb-1">Pressão Diastólica:</label>
                        <input
                            type="number"
                            name="Pressão Arterial Diastólica"
                            id="pressao-diastolica"
                            value={formData['Pressão Arterial Diastólica'] ?? ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="imc-valor" className="block text-sm font-medium text-gray-700 mb-1">IMC Valor:</label>
                        <input
                            type="number"
                            name="IMC_valor"
                            id="imc-valor"
                            value={formData['IMC_valor'] ?? ''}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="circunferencia-abdominal" className="block text-sm font-medium text-gray-700 mb-1">Circunferência Abdominal (cm):</label>
                        <input
                            type="number"
                            name="Circunferência Abdominal"
                            id="circunferencia-abdominal"
                            value={formData['Circunferência Abdominal'] ?? ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                    <div>
                        <label htmlFor="atividade-fisica" className="block text-sm font-medium text-gray-700 mb-1">Atividade Física:</label>
                        <select
                            name="Atividade Física"
                            id="atividade-fisica"
                            value={formData['Atividade Física']}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                        >
                            <option value="Não">Não</option>
                            <option value="Sim">Sim</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tabagista" className="block text-sm font-medium text-gray-700 mb-1">Tabagista:</label>
                        <select
                            name="Tabagista"
                            id="tabagista"
                            value={formData.Tabagista}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                        >
                            <option value="Não">Não</option>
                            <option value="Sim">Sim</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sono" className="block text-sm font-medium text-gray-700 mb-1">Sono (horas/noite):</label>
                        <input
                            type="number"
                            name="Sono"
                            id="sono"
                            value={formData.Sono ?? ''}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        {healthRecordToEdit ? 'Salvar Alterações' : 'Adicionar Registro'}
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

export default HealthDataForm;
