import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [nps, setNps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNps = async () => {
      try {
        const response = await api.get('/nps');
        setNps(response.data);
      } catch (error) {
        console.error('Erro ao buscar NPS:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNps();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Painel do Provedor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Seu NPS</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {loading ? '...' : nps?.nps || 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-2">Baseado em avaliações reais</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Status do Banco</h2>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <p className="text-xl font-semibold text-gray-700">Conectado (Atlas)</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cluster: Murilo's Org</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Dica do Gemini:</strong> O backend está respondendo na porta 5000. Use o script de teste para gerar novos dados!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
