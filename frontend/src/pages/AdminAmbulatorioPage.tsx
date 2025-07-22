import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { users, healthData } from '../services/api';
import UserForm from '../components/UserForm';
import HealthDataForm from '../components/HealthDataForm';
import { PlusCircle, Edit, Trash2, User as UserIcon, Activity } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface User {
    id: string;
    name: string;
    username: string;
    type: 'user' | 'admin';
    registro?: string;
    cpf?: string;
}

interface HealthRecord {
    id: string;
    user_id: string;
    data_exame: string;
    userName?: string;
    userRegistro?: string;
    isg_score_total?: number;
    isg_classification?: string;
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

// Componente Modal de Confirmação (Substitui window.confirm)
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente Modal de Alerta/Sucesso (Substitui alert)
interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    title: string;
    type?: 'success' | 'error' | 'info';
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, message, title, type = 'info' }) => {
    if (!isOpen) return null;

    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';
    if (type === 'success') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
    } else if (type === 'error') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg shadow-lg w-full max-w-sm ${bgColor}`}>
                <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h3>
                <p className={`mb-6 ${textColor}`}>{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-md transition-colors ${type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


const AdminAmbulatorioPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [userList, setUserList] = useState<User[]>([]);
    const [healthDataList, setHealthDataList] = useState<HealthRecord[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingHealthData, setLoadingHealthData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para os modais de formulário
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showHealthDataForm, setShowHealthDataForm] = useState(false);
    const [editingHealthRecord, setEditingHealthRecord] = useState<HealthRecord | null>(null);

    // Estados para os modais de confirmação/alerta
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [confirmModalTitle, setConfirmModalTitle] = useState('');
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertModalMessage, setAlertModalMessage] = useState('');
    const [alertModalTitle, setAlertModalTitle] = useState('');
    const [alertModalType, setAlertModalType] = useState<'success' | 'error' | 'info'>('info');

    // Fetch de Usuários
    const fetchUsers = useCallback(async () => {
        if (user && user.user_type === 'admin') {
            setLoadingUsers(true);
            setError(null);
            try {
                const response = await users.getAllUsers();

                const rawUsers = response.data as {
                    id: string, name: string, username: string; type: 'user' | 'admin';
                    registro?: string; cpf?: string;
                }[];
                const mappedUsers: User[] = rawUsers.map((u) => ({
                    id: u.id,
                    name: u.name,
                    username: u.username,
                    type: u.type, // 'type' do backend
                    registro: u.registro,
                    cpf: u.cpf,
                    // Garanta que outros campos necessários para a Navbar ou Profile estejam aqui
                    // avatar: u.avatar,
                    // email: u.email,
                    // department: u.department,
                }));
                setUserList(mappedUsers);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar usuários.');
                console.error('Fetch users error:', err);
            } finally {
                setLoadingUsers(false);
            }
        } else {
            setError('Acesso negado. Apenas administradores podem ver esta página.');
            setLoadingUsers(false);
        }
    }, [user]);

    // Fetch de Dados de Saúde
    const fetchHealthData = useCallback(async () => {
        if (user && user.user_type === 'admin') {
            setLoadingHealthData(true);
            setError(null);
            try {
                const response = await healthData.getAllHealthData();
                const rawHealthData = response.data as HealthRecord[];
                const enrichedData: HealthRecord[] = rawHealthData.map((record: any) => {
                    const associatedUser = userList.find(u => u.id === String(record.user_id));
                    return {
                        ...record,
                        userName: associatedUser ? associatedUser.name : 'Desconhecido',
                        userRegistro: associatedUser ? (associatedUser.registro || associatedUser.cpf) : 'N/A'
                    };
                });
                setHealthDataList(enrichedData);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao carregar dados de saúde.');
                console.error('Fetch health data error:', err);
            } finally {
                setLoadingHealthData(false);
            }
        }
    }, [user, userList]); // userList é uma dependência crucial aqui

    // Efeitos para carregar dados
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        // Só busca dados de saúde depois que os usuários foram carregados e se houver usuários
        if (!loadingUsers && userList.length > 0) {
            fetchHealthData();
        } else if (!loadingUsers && userList.length === 0) {
            // Se não há usuários, não há dados de saúde para carregar
            setLoadingHealthData(false);
        }
    }, [userList, loadingUsers, fetchHealthData]);

    // Handlers para Usuários
    const handleAddUserClick = () => {
        setEditingUser(null);
        setShowUserForm(true);
    };

    const handleEditUserClick = (userToEdit: User) => {
        setEditingUser(userToEdit);
        setShowUserForm(true);
    };

    const handleUserFormSubmit = async (formData: any) => { // formData pode vir com 'type' ou 'user_type'
        setError(null);
        try {
            // Garante que o campo 'type' seja usado, se o backend espera 'type'
            const dataToSend = { ...formData, type: formData.type || formData.user_type };

            if (editingUser) {
                await users.updateUser(editingUser.id, dataToSend);
                setAlertModalTitle('Sucesso!');
                setAlertModalMessage('Usuário atualizado com sucesso!');
                setAlertModalType('success');
            } else {
                await users.addUser(dataToSend);
                setAlertModalTitle('Sucesso!');
                setAlertModalMessage('Usuário adicionado com sucesso!');
                setAlertModalType('success');
            }
            setShowUserForm(false);
            setShowAlertModal(true);
            await fetchUsers(); // Recarrega a lista de usuários
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao salvar usuário. Verifique os dados e tente novamente.';
            setError(errorMessage);
            setAlertModalTitle('Erro!');
            setAlertModalMessage(errorMessage);
            setAlertModalType('error');
            setShowAlertModal(true);
            console.error('Save user error:', err);
        }
    };

    const handleDeleteUser = (userId: string) => {
        setConfirmModalTitle('Confirmar Exclusão');
        setConfirmModalMessage('Tem certeza que deseja remover este usuário? Esta ação é irreversível.');
        setConfirmAction(() => async () => {
            setError(null);
            try {
                await users.deleteUser(userId);
                setAlertModalTitle('Sucesso!');
                setAlertModalMessage('Usuário removido com sucesso!');
                setAlertModalType('success');
                setShowAlertModal(true);
                await fetchUsers(); // Recarrega a lista de usuários
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Erro ao remover usuário.';
                setError(errorMessage);
                setAlertModalTitle('Erro!');
                setAlertModalMessage(errorMessage);
                setAlertModalType('error');
                setShowAlertModal(true);
                console.error('Delete user error:', err);
            }
        });
        setShowConfirmModal(true);
    };

    // Handlers para Dados de Saúde
    const handleAddHealthDataClick = () => {
        setEditingHealthRecord(null);
        setShowHealthDataForm(true);
    };

    const handleEditHealthDataClick = (recordToEdit: HealthRecord) => {
        setEditingHealthRecord(recordToEdit);
        setShowHealthDataForm(true);
    };

    const handleHealthDataFormSubmit = async (formData: any) => {
        setError(null);
        try {
            const dataToSend = { ...formData };

            if (editingHealthRecord) {
                await healthData.updateHealthData(editingHealthRecord.id, dataToSend);
                setAlertModalTitle('Sucesso!');
                setAlertModalMessage('Registro de saúde atualizado com sucesso!');
                setAlertModalType('success');
            } else {
                await healthData.addHealthData(dataToSend);
                setAlertModalTitle('Sucesso!');
                setAlertModalMessage('Registro de saúde adicionado com sucesso!');
                setAlertModalType('success');
            }
            setShowHealthDataForm(false);
            setShowAlertModal(true);
            await fetchHealthData(); // Recarrega a lista de dados de saúde
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao salvar registro de saúde. Verifique os dados e tente novamente.';
            setError(errorMessage);
            setAlertModalTitle('Erro!');
            setAlertModalMessage(errorMessage);
            setAlertModalType('error');
            setShowAlertModal(true);
            console.error('Save health data error:', err);
        }
    };

    const handleDeleteHealthData = (recordId: string) => {
        setConfirmModalTitle('Confirmar Exclusão');
        setConfirmModalMessage('Tem certeza que deseja remover este registro de saúde? Esta ação é irreversível.');
        setConfirmAction(() => async () => {
            setError(null);
            try {
                await healthData.deleteHealthData(recordId);
                setAlertModalTitle('Sucesso!');
                setAlertModalMessage('Registro de saúde removido com sucesso!');
                setAlertModalType('success');
                setShowAlertModal(true);
                await fetchHealthData(); // Recarrega a lista de dados de saúde
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Erro ao remover registro de saúde.';
                setError(errorMessage);
                setAlertModalTitle('Erro!');
                setAlertModalMessage(errorMessage);
                setAlertModalType('error');
                setShowAlertModal(true);
                console.error('Delete health data error:', err);
            }
        });
        setShowConfirmModal(true);
    };


    if (loadingUsers || loadingHealthData) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-700">
                <svg className="animate-spin h-8 w-8 text-purple-600 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando dados...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Erro</h2>
                <p>{error}</p>
            </div>
        );
    }

    // Redireciona se não for admin (embora PrivateRoute já faça isso)
    if (!user || user.user_type !== 'admin') {
        return <Navigate to="/login" replace />; // Fallback de segurança
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Ambulatório (Administrador)</h1>
                {/* O botão Sair da Navbar já lida com o logout */}
                {/* <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Sair</button> */}
            </div>

            {/* Formulários de Adição/Edição */}
            {showUserForm && (
                <UserForm
                    userToEdit={editingUser}
                    onSubmit={handleUserFormSubmit}
                    onCancel={() => setShowUserForm(false)}
                />
            )}
            {showHealthDataForm && (
                <HealthDataForm
                    healthRecordToEdit={editingHealthRecord}
                    onSubmit={handleHealthDataFormSubmit}
                    onCancel={() => setShowHealthDataForm(false)}
                    usersList={userList} // Passa a lista de usuários para o HealthDataForm
                />
            )}

            {/* Seções de Gestão */}
            <section className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
                        <UserIcon className="w-6 h-6 text-purple-600" />
                        <span>Gestão de Usuários</span>
                    </h2>
                    <button
                        onClick={handleAddUserClick}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Adicionar Novo Usuário</span>
                    </button>
                </div>

                {userList.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro/CPF</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userList.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.registro || u.cpf}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditUserClick(u)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5 inline-block" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 mt-4">Nenhum usuário encontrado.</p>
                )}
            </section>

            <section className="mt-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
                        <Activity className="w-6 h-6 text-purple-600" />
                        <span>Gestão de Dados de Saúde</span>
                    </h2>
                    <button
                        onClick={handleAddHealthDataClick}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Adicionar Novo Registro de Saúde</span>
                    </button>
                </div>

                {healthDataList.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Reg.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionário</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Exame</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISG Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {healthDataList.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.userName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.userRegistro}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.data_exame}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.isg_score_total ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.isg_classification || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditHealthDataClick(record)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                title="Detalhes / Editar"
                                            >
                                                <Edit className="w-5 h-5 inline-block" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteHealthData(record.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 mt-4">Nenhum registro de saúde encontrado.</p>
                )}
            </section>

            {/* Modais de Confirmação e Alerta */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    if (confirmAction) confirmAction();
                    setConfirmAction(null); // Limpa a ação
                }}
                message={confirmModalMessage}
                title={confirmModalTitle}
            />
            <AlertModal
                isOpen={showAlertModal}
                onClose={() => setShowAlertModal(false)}
                message={alertModalMessage}
                title={alertModalTitle}
                type={alertModalType}
            />
        </div>
    );
};

export default AdminAmbulatorioPage;
