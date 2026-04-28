import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNps = async () => {
      try {
        const response = await api.get('/nps');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do NPS:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNps();
  }, []);

  const getStatusColor = (nps) => {
    if (nps >= 75) return 'text-green-600';
    if (nps >= 50) return 'text-blue-600';
    if (nps >= 0) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Dashboard de Performance</h1>
            <p className="text-gray-500">Acompanhe sua reputação e métricas de satisfação.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Live: MongoDB Atlas</span>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Card Principal NPS */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Net Promoter Score</h2>
              <div className="flex items-baseline mt-2">
                <span className={`text-7xl font-black ${loading ? 'text-gray-200' : getStatusColor(data?.nps)}`}>
                  {loading ? '--' : data?.nps}
                </span>
                <span className="ml-2 text-gray-400 font-bold uppercase text-xs">Pontos</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex">
                <div style={{ width: `${(data?.promoters / data?.total) * 100 || 0}%` }} className="bg-green-500 h-full"></div>
                <div style={{ width: `${(data?.passives / data?.total) * 100 || 0}%` }} className="bg-orange-400 h-full"></div>
                <div style={{ width: `${(data?.detractors / data?.total) * 100 || 0}%` }} className="bg-red-500 h-full"></div>
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase">
                <span>Promotores: {data?.promoters}</span>
                <span>Passivos: {data?.passives}</span>
                <span>Detratores: {data?.detractors}</span>
              </div>
            </div>
          </div>

          {/* Card Total de Avaliações */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Reviews</h2>
            <p className="text-5xl font-black text-gray-900 mt-4">{loading ? '--' : data?.total}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">Crescimento de +12% este mês</p>
          </div>

          {/* Card Status do Sistema */}
          <div className="bg-blue-600 p-8 rounded-3xl shadow-lg shadow-blue-100 text-white flex flex-col justify-between">
            <h2 className="text-blue-200 text-xs font-bold uppercase tracking-widest">Service Status</h2>
            <div>
              <p className="text-2xl font-bold">100% Online</p>
              <p className="text-blue-100 text-xs mt-1">API & WebSockets ativos.</p>
            </div>
          </div>
        </div>

        {/* Lista de Reviews Recentes */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Feedback dos Clientes</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">Ver todos</button>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-10 text-center text-gray-400">Carregando feedbacks...</div>
            ) : data?.reviews?.length === 0 ? (
              <div className="p-10 text-center text-gray-400">Nenhuma avaliação recebida ainda.</div>
            ) : (
              data?.reviews.map((review) => (
                <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs mr-3 ${
                        review.score >= 9 ? 'bg-green-500' : review.score >= 7 ? 'bg-orange-400' : 'bg-red-500'
                      }`}>
                        {review.score}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">Cliente #{review._id.slice(-4)}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm ml-11">{review.comment || 'O cliente não deixou um comentário por escrito.'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
