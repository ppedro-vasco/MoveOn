// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Users, ChefHat, Trophy, Home, UserCircle, LogOut, Briefcase, Stethoscope } from 'lucide-react'; // Importa o ícone Stethoscope
import { useAuth } from '../context/AuthContext';

// Interface para as props do NavLink
interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    text: string;
}

// Interface User para a Navbar (DEVE ser a mesma do AuthContext.tsx e App.tsx)
interface User {
    id: string;
    username: string;
    name: string;
    user_type: 'admin' | 'user';
    cpf?: string;
    registro?: string;
    email?: string;
    department?: string;
    avatar?: string; // Opcional
}

// Componente auxiliar para links de navegação
const NavLink: React.FC<NavLinkProps> = ({ to, icon, text }) => {
    return (
        <Link
            to={to}
            className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
        >
            {icon}
            <span>{text}</span>
        </Link>
    );
};

// Componente Navbar principal
const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Activity className="h-8 w-8 text-purple-600" />
                        <span className="text-xl font-bold text-gray-800">Move on</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <NavLink to="/" icon={<Home />} text="Home" />
                        <NavLink to="/health-tracker" icon={<Activity />} text="Saúde" />
                        <NavLink to="/community" icon={<Users />} text="Comunidade" />
                        <NavLink to="/recipes" icon={<ChefHat />} text="Receitas" />
                        <NavLink to="/programs" icon={<Trophy />} text="Programas" />
                        <NavLink to="/humanresources" icon={<Briefcase />} text="Recursos Humanos" />
                        {/* NOVO: Link para Ambulatório */}
                        {user && (user.user_type === 'admin' || user.user_type === 'user') && (
                            <NavLink to="/ambulatorio" icon={<Stethoscope />} text="Ambulatório" />
                        )}

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                                    <img
                                        src={user.avatar || `https://placehold.co/32x32/A78BFA/ffffff?text=${user.name ? user.name.charAt(0).toUpperCase() : 'U'}`}
                                        alt={user.name || "User"}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://placehold.co/32x32/A78BFA/ffffff?text=${user.name ? user.name.charAt(0).toUpperCase() : 'U'}`;
                                        }}
                                    />
                                    <span className="hidden md:block">{user.name || user.username}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-10">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50"
                                    >
                                        <UserCircle className="w-4 h-4" />
                                        <span>Perfil</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50 w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                            >
                                <UserCircle className="w-5 h-5" />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
