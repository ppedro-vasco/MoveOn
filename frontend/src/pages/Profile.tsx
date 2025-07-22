import React from 'react';
import { Mail, Building2, Award, Activity, Calendar, Trophy } from 'lucide-react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500"></div>
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center -mt-16 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-1" />
                  {user.department}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatCard
              icon={<Activity className="w-5 h-5 text-green-500" />}
              title="Atividades"
              value="28"
              label="este mês"
            />
            <StatCard
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              title="Programas"
              value="4"
              label="participando"
            />
            <StatCard
              icon={<Trophy className="w-5 h-5 text-yellow-500" />}
              title="Conquistas"
              value="12"
              label="desbloqueadas"
            />
            <StatCard
              icon={<Award className="w-5 h-5 text-purple-500" />}
              title="Ranking"
              value="#15"
              label="posição geral"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Completou treino"
              program="Mover para Cuidar"
              date="Hoje"
            />
            <ActivityItem
              title="Registrou refeição"
              program="Cardápio Semanal"
              date="Ontem"
            />
            <ActivityItem
              title="Conquista desbloqueada"
              program="Madrugador"
              date="3 dias atrás"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
          <div className="space-y-4">
            <EventItem
              title="Treino em Grupo"
              program="Mover para Cuidar"
              date="Amanhã, 15:00"
            />
            <EventItem
              title="Avaliação Mensal"
              program="Acompanhamento"
              date="Em 3 dias"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, label }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function ActivityItem({ title, program, date }: {
  title: string;
  program: string;
  date: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{title}</p>
        <p className="text-sm text-gray-500">{program}</p>
      </div>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
  );
}

function EventItem({ title, program, date }: {
  title: string;
  program: string;
  date: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{title}</p>
        <p className="text-sm text-gray-500">{program}</p>
      </div>
      <span className="text-sm text-purple-600">{date}</span>
    </div>
  );
}

export default Profile;