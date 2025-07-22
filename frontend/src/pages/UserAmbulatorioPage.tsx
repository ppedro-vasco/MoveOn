// src/pages/UserAmbulatorioPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { healthData } from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Navigate } from 'react-router-dom';

// Registre os componentes do Chart.js que você vai usar
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Interface para os dados de saúde
interface HealthRecord {
    id: string;
    user_id: string;
    data_exame: string; // YYYY-MM-DD
    isg_score_total?: number;
    isg_classification?: string;
    isg_score_level?: number;
    isg_message?: string;
    Glicemia?: number | null;
    'Hemoglobina Glicada'?: number | null;
    Triglicérides?: number | null;
    'Colesterol LDL'?: number | null;
    Ferritina?: number | null;
    TSH?: number | null;
    Homocisteína?: number | null;
    'Gama GT'?: number | null;
    Creatina?: number | null;
    'Vitamina B12'?: number | null;
    'Vitamina D'?: number | null;
    'Doenças Crônicas Pré-existentes'?: string;
    'Pressão Arterial Sistólica'?: number | null;
    'Pressão Arterial Diastólica'?: number | null;
    'IMC_valor'?: number | null;
    'Circunferência Abdominal'?: number | null;
    'Atividade Física'?: string;
    'Tabagista'?: string;
    'Sono'?: number | null;
    gender?: string;
}

const UserAmbulatorioPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [userHealthData, setUserHealthData] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserHealthData = async () => {
            if (user && user.id) {
                setLoading(true);
                setError(null);
                try {
                    const response = await healthData.getUserHealthData(user.id);
                    const rawData = response.data as HealthRecord[];
                    const sortedData = rawData.sort((a, b) => new Date(a.data_exame).getTime() - new Date(b.data_exame).getTime());
                    setUserHealthData(sortedData);
                    console.log("UserAmbulatorioPage: Dados de saúde do usuário carregados:", sortedData);
                } catch (err: any) {
                    setError(err.response?.data?.message || 'Erro ao carregar seus dados de saúde.');
                    console.error('Fetch health data error:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchUserHealthData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-700">
                <svg className="animate-spin h-8 w-8 text-purple-600 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando dados de saúde...
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

    if (!user || user.user_type !== 'user') {
        return <Navigate to="/login" replace />;
    }

    const latestHealthRecord = userHealthData.length > 0 ? userHealthData[userHealthData.length - 1] : null;

    const chartLabels = userHealthData.map(record => record.data_exame);
    const isgScoreData = userHealthData.map(record => record.isg_score_total ?? 0);
    const isgLevelData = userHealthData.map(record => record.isg_score_level ?? 0);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'ISG Score Total',
                data: isgScoreData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: false,
                yAxisID: 'y'
            },
            {
                label: 'Nível de Risco ISG (1=Baixo, 2=Médio, 3=Alto)',
                data: isgLevelData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: false,
                yAxisID: 'y1'
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Acompanhamento do Indicador de Saúde Geral (ISG)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'ISG Score Total',
                },
                grid: {
                    drawOnChartArea: true,
                },
                min: 0,
                // max: 30,
            },
            y1: {
                type: 'linear' as const,
                position: 'right' as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Nível de Risco',
                },
                grid: {
                    drawOnChartArea: false,
                },
                min: 0,
                max: 3.5,
                ticks: {
                    stepSize: 1,
                    // CORREÇÃO AQUI: A tipagem do callback é mais complexa, use 'any' para o 'this' e 'tickValue'
                    callback: function (this: any, tickValue: string | number) {
                        if (tickValue === 1) return 'Baixo';
                        if (tickValue === 2) return 'Médio';
                        if (tickValue === 3) return 'Alto';
                        return '';
                    }
                }
            },
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Ambulatório (Colaborador)</h1>
            </div>

            {latestHealthRecord ? (
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Seu Último ISG - {latestHealthRecord.data_exame}</h2>
                    <p className="text-lg text-gray-700">Classificação: <strong className="text-purple-600">{latestHealthRecord.isg_classification}</strong></p>
                    <p className="text-lg text-gray-700">Score Total: <strong className="text-purple-600">{latestHealthRecord.isg_score_total}</strong></p>
                    <p className="text-lg text-gray-700">ISG Nível: <strong className="text-purple-600">{latestHealthRecord.isg_score_level}</strong></p>
                    <div className="border border-gray-300 p-4 rounded-md bg-white mt-4 whitespace-pre-wrap">
                        <p className="text-gray-700">{latestHealthRecord.isg_message}</p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Detalhes do Último Exame:</h3>
                    <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-gray-700">
                        <li><strong>Registro:</strong> {user.registro || user.cpf || 'N/A'}</li>
                        <li><strong>Glicemia:</strong> {latestHealthRecord.Glicemia ?? 'N/A'} mg/dL</li>
                        <li><strong>Hemoglobina Glicada:</strong> {latestHealthRecord['Hemoglobina Glicada'] ?? 'N/A'}%</li>
                        <li><strong>Triglicérides:</strong> {latestHealthRecord.Triglicérides ?? 'N/A'} mg/dL</li>
                        <li><strong>Colesterol LDL:</strong> {latestHealthRecord['Colesterol LDL'] ?? 'N/A'} mg/dL</li>
                        <li><strong>Ferritina:</strong> {latestHealthRecord.Ferritina ?? 'N/A'} ng/mL</li>
                        <li><strong>TSH:</strong> {latestHealthRecord.TSH ?? 'N/A'} mUI/L</li>
                        <li><strong>Homocisteína:</strong> {latestHealthRecord.Homocisteína ?? 'N/A'} µmol/L</li>
                        <li><strong>Gama GT:</strong> {latestHealthRecord['Gama GT'] ?? 'N/A'} U/L</li>
                        <li><strong>Creatina:</strong> {latestHealthRecord.Creatina ?? 'N/A'} mg/dL</li>
                        <li><strong>Vitamina B12:</strong> {latestHealthRecord['Vitamina B12'] ?? 'N/A'} pg/mL</li>
                        <li><strong>Vitamina D:</strong> {latestHealthRecord['Vitamina D'] ?? 'N/A'} ng/mL</li>
                        <li><strong>Doenças Crônicas Pré-existentes:</strong> {latestHealthRecord['Doenças Crônicas Pré-existentes'] || 'N/A'}</li>
                        <li><strong>Pressão Arterial:</strong> {latestHealthRecord['Pressão Arterial Sistólica'] ?? 'N/A'}/{latestHealthRecord['Pressão Arterial Diastólica'] ?? 'N/A'} mmHg</li>
                        <li><strong>IMC:</strong> {latestHealthRecord.IMC_valor ?? 'N/A'}</li>
                        <li><strong>Circunferência Abdominal:</strong> {latestHealthRecord['Circunferência Abdominal'] ?? 'N/A'} cm</li>
                        <li><strong>Atividade Física:</strong> {latestHealthRecord['Atividade Física'] || 'N/A'}</li>
                        <li><strong>Tabagista:</strong> {latestHealthRecord.Tabagista || 'N/A'}</li>
                        <li><strong>Sono:</strong> {latestHealthRecord.Sono ?? 'N/A'} horas/noite</li>
                    </ul>
                </div>
            ) : (
                <p className="text-gray-600 mt-4">Nenhum dado de saúde encontrado para você. Por favor, entre em contato com o ambulatório.</p>
            )}

            {userHealthData.length > 1 && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-8 h-[400px]">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Acompanhamento do ISG ao Longo do Tempo</h3>
                    <div className="relative h-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAmbulatorioPage;
