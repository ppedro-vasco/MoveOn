import React, { useState } from 'react';
import {
  Clock,
  Users as Servings,
  ChefHat,
  Search,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';

function Recipes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Receitas Saudáveis</h1>
          <p className="text-gray-600 mt-2">Descubra receitas nutritivas e deliciosas</p>
        </div>
        <MonteSeuPrato isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </header>

      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-md p-4">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar receitas..."
          className="flex-1 border-none focus:ring-0"
        />
      </div>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Cardápio da Semana</h2>
          <div className="flex items-center space-x-2 text-purple-600">
            <Calendar className="w-5 h-5" />
            <span>27-31 Janeiro</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <DayMenu day="Segunda" mainDish="Frango Grelhado" sideDish="Torta de Carne c/ Legumes" salad="Mix de Folhas" dessert="Frutas Frescas" />
          <DayMenu day="Terça" mainDish="Peixe ao Forno" sideDish="Arroz Integral" salad="Salada Caprese" dessert="Iogurte Natural" />
          <DayMenu day="Quarta" mainDish="Strogonoff de Grão" sideDish="Batata Doce" salad="Salada Tropical" dessert="Gelatina Zero" />
          <DayMenu day="Quinta" mainDish="Bife de Panela" sideDish="Purê de Mandioca" salad="Salada Colorida" dessert="Mousse Proteico" />
          <DayMenu day="Sexta" mainDish="Salmão Grelhado" sideDish="Legumes Assados" salad="Salada Caesar" dessert="Pudim Fit" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Pratos da Comunidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CommunityPost
            username="Maria Silva"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            description="Meu almoço de hoje seguindo o cardápio: Frango grelhado com quinoa e legumes. Adorei a combinação!"
            likes={24}
            comments={8}
            menuItem="Segunda-feira"
          />
          <CommunityPost
            username="João Santos"
            avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36"
            image="https://images.unsplash.com/photo-1467003909585-2f8a72700288"
            description="Adaptei o cardápio de hoje com mais vegetais. Ficou incrível!"
            likes={16}
            comments={5}
            menuItem="Terça-feira"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Receitas em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeCard
            title="Bowl de Açaí Proteico"
            image="https://images.unsplash.com/photo-1546039907-7fa05f864c02"
            time="10 min"
            servings="2"
            chef="Nutricionista Ana"
            difficulty="Fácil"
          />
          <RecipeCard
            title="Salada de Quinoa"
            image="https://images.unsplash.com/photo-1505576399279-565b52d4ac71"
            time="20 min"
            servings="4"
            chef="Chef Carlos"
            difficulty="Médio"
          />
          <RecipeCard
            title="Smoothie Verde"
            image="https://images.unsplash.com/photo-1610970881699-44a5587cabec"
            time="5 min"
            servings="1"
            chef="Nutricionista Paula"
            difficulty="Fácil"
          />
        </div>
      </section>
    </div>
  );
}

function MonteSeuPrato({ isModalOpen, setIsModalOpen }) {
  return (
    <div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        onClick={() => setIsModalOpen(true)}
      >
        Monte seu prato
      </button>
      <MonteSeuPratoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function MonteSeuPratoModal({ isOpen, onClose }) {
  const alimentos = [
    { alimento: "Feijão", porção: "165g", calorias_kcal: 127.0 },
    { alimento: "Arroz", porção: "70g", calorias_kcal: 89.6 },
    { alimento: "Arroz à grega", porção: "1 colher", calorias_kcal: 77.0 },
    { alimento: "Feijoada", porção: "1 concha - 180g", calorias_kcal: 389.0 },
    { alimento: "Filé de Frango a Milanesa", porção: 1, calorias_kcal: 320.0 },
    { alimento: "Filé de Frango á Milanesa", porção: "100g", calorias_kcal: 260.0 },
    { alimento: "Salada Alemã", porção: "100g", calorias_kcal: 154.0 },
    { alimento: "Salada Brasileira", porção: null, calorias_kcal: null },
    { alimento: "Salada Crocante", porção: "1 colher", calorias_kcal: 75.0 },
    { alimento: "Salada de Abóbora", porção: "80g", calorias_kcal: 15.9 },
    { alimento: "Tomate", porção: "1 porção", calorias_kcal: 12.0 },
    { alimento: "Tomate c/ Azeitona", porção: "1 colher", calorias_kcal: 32.0 },
  ];

  const [selecionados, setSelecionados] = useState([]);

  const adicionar = (alimento) => {
    if (!selecionados.find((a) => a.alimento === alimento.alimento)) {
      setSelecionados([...selecionados, alimento]);
    }
  };

  const remover = (nome) => {
    setSelecionados(selecionados.filter((a) => a.alimento !== nome));
  };

  const totalCalorias = selecionados.reduce((acc, item) => acc + (item.calorias_kcal || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Monte seu prato</h2>

        <select
          className="w-full border p-2 rounded"
          onChange={(e) => {
            const item = alimentos.find((a) => a.alimento === e.target.value);
            if (item) adicionar(item);
            e.target.value = "";
          }}
        >
          <option value="">Selecione um alimento</option>
          {alimentos.map((a) => (
            <option key={a.alimento} value={a.alimento}>
              {a.alimento} ({a.porção || "porção desconhecida"})
            </option>
          ))}
        </select>

        <ul className="space-y-2">
          {selecionados.map((item) => (
            <li key={item.alimento} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{item.alimento} – {item.porção || "porção ?"} ({item.calorias_kcal ?? "?"} kcal)</span>
              <button onClick={() => remover(item.alimento)} className="text-red-500">Remover</button>
            </li>
          ))}
        </ul>

        <div className="text-right font-semibold">Total: {totalCalorias.toFixed(1)} kcal</div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Fechar</button>
          <button onClick={() => { alert("Prato enviado!"); onClose(); setSelecionados([]); }} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Submeter prato
          </button>
        </div>
      </div>
    </div>
  );
}

function DayMenu({ day, mainDish, sideDish, salad, dessert }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-purple-600 mb-3">{day}</h3>
      <div className="space-y-2 text-sm">
        <p className="font-medium text-gray-800">{mainDish}</p>
        <p className="text-gray-600">{sideDish}</p>
        <p className="text-gray-600">{salad}</p>
        <p className="text-gray-500 italic">{dessert}</p>
      </div>
    </div>
  );
}

function CommunityPost({ username, avatar, image, description, likes, comments, menuItem }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img src={avatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-800">{username}</h3>
            <p className="text-sm text-purple-600">{menuItem}</p>
          </div>
        </div>
      </div>
      <img src={image} alt="Prato" className="w-full h-64 object-cover" />
      <div className="p-4">
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center space-x-6 text-gray-500">
          <button className="flex items-center space-x-2 hover:text-purple-600">
            <Heart className="w-5 h-5" />
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-purple-600">
            <MessageCircle className="w-5 h-5" />
            <span>{comments}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-purple-600">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ title, image, time, servings, chef, difficulty }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Servings className="w-4 h-4" />
            <span>{servings} porções</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">{chef}</span>
          </div>
          <span className="text-sm font-medium text-purple-600">{difficulty}</span>
        </div>
      </div>
    </div>
  );
}

export default Recipes;
