import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import ReviewForm from '../components/ReviewForm';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Provider
  const [newService, setNewService] = useState({ title: '', description: '', price: '', executionDate: '', clientId: '' });
  const [editingService, setEditingService] = useState(null);

  // Form states for Client Reviews
  const [editingReview, setEditingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewingServiceId, setReviewingServiceId] = useState(null);

  const fetchData = async () => {
    try {
      if (user.type === 'provider') {
        const [npsRes, servicesRes, clientsRes] = await Promise.all([
          api.get('/nps'),
          api.get('/services'),
          api.get('/auth/clients')
        ]);
        setData(npsRes.data);
        setServices(servicesRes.data.filter(s => s.providerId?._id === user.id));
        setClients(clientsRes.data);
      } else {
        const [servicesRes, reviewsRes] = await Promise.all([
          api.get('/services'),
          api.get('/reviews')
        ]);
        setServices(servicesRes.data.filter(s => s.clientId?._id === user.id));
        setReviews(reviewsRes.data.filter(r => r.clientId?._id === user.id));
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user, navigate]);

  // Provider: Create Service
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/services', newService);
      setServices([...services, res.data]);
      setNewService({ title: '', description: '', price: '', executionDate: '', clientId: '' });
      toast.success('Serviço criado!');
    } catch (err) {
      toast.error('Erro ao criar serviço');
    }
  };

  // Provider: Update Service
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/services/${editingService._id}`, editingService);
      setServices(services.map(s => s._id === editingService._id ? res.data : s));
      setEditingService(null);
      toast.success('Serviço atualizado!');
    } catch (err) {
      toast.error('Erro ao atualizar serviço');
    }
  };

  // Provider: Update Status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/services/${id}/status`, { status });
      setServices(services.map(s => s._id === id ? res.data : s));
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error('Transição de status inválida');
    }
  };

  // Provider: Delete Service
  const handleDeleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
      toast.success('Serviço deletado!');
    } catch (err) {
      toast.error('Erro ao deletar serviço');
    }
  };

  // Client: Update Review
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/reviews/${editingReview._id}`, { score: editingReview.score, comment: editingReview.comment });
      setReviews(reviews.map(r => r._id === editingReview._id ? res.data : r));
      setEditingReview(null);
      toast.success('Avaliação atualizada!');
    } catch (err) {
      toast.error('Erro ao atualizar avaliação');
    }
  };

  // Client: Delete Review
  const handleDeleteReview = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
      toast.success('Avaliação deletada!');
    } catch (err) {
      toast.error('Erro ao deletar avaliação');
    }
  };

  // Client: Create Review from a Service
  const handleCreateReview = async (serviceId, score, comment) => {
    try {
      const res = await api.post('/reviews', { serviceId, score, comment });
      setReviews([...reviews, res.data]);
      toast.success('Avaliação enviada!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar avaliação');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Dashboard de {user?.name}</h1>
            <p className="text-gray-500">Painel de controle ({user?.type})</p>
          </div>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
            Sair
          </button>
        </header>

        {user?.type === 'provider' && (
          <>
            {/* NPS Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold mb-4">Seu Net Promoter Score (NPS)</h2>
              <div className="flex gap-8 items-center">
                <div className="text-5xl font-black text-blue-600">{data?.nps || 0}</div>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <span>Promotores: {data?.promoters || 0}</span>
                  <span>Passivos: {data?.passives || 0}</span>
                  <span>Detratores: {data?.detractors || 0}</span>
                </div>
              </div>
            </div>

            {/* Gerenciar Serviços */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4">Gerenciar Serviços</h2>
              
              {/* Form Create */}
              <form onSubmit={handleCreateService} className="flex gap-4 mb-6 flex-wrap">
                <input type="text" placeholder="Título" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="border p-2 rounded w-full md:w-auto flex-1" />
                <input type="number" placeholder="Preço" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} className="border p-2 rounded w-24" />
                <input type="date" required value={newService.executionDate} onChange={e => setNewService({...newService, executionDate: e.target.value})} className="border p-2 rounded" />
                <select required value={newService.clientId} onChange={e => setNewService({...newService, clientId: e.target.value})} className="border p-2 rounded">
                  <option value="">Selecione o Cliente</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="Descrição" required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="border p-2 rounded w-full mt-2" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold w-full mt-2">Criar Serviço</button>
              </form>

              {/* Edit Form */}
              {editingService && (
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded">
                  <h3 className="font-bold mb-2">Editar Serviço</h3>
                  <form onSubmit={handleUpdateService} className="flex gap-4 flex-wrap">
                    <input type="text" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="border p-2 rounded flex-1" />
                    <input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} className="border p-2 rounded w-24" />
                    <input type="text" value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="border p-2 rounded w-full mt-2" />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold w-full md:w-auto mt-2">Salvar</button>
                    <button type="button" onClick={() => setEditingService(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold w-full md:w-auto mt-2">Cancelar</button>
                  </form>
                </div>
              )}

              {/* List Services */}
              <div className="space-y-4">
                {services.map(s => (
                  <div key={s._id} className="p-4 border rounded flex justify-between items-center bg-gray-50">
                    <div>
                      <div className="font-bold">{s.title} - R${s.price}</div>
                      <div className="text-sm text-gray-500">Status: {s.status} | Cliente: {s.clientId?.name || 'N/A'}</div>
                    </div>
                    <div className="flex gap-2">
                      {s.status === 'scheduled' && <button onClick={() => handleStatusChange(s._id, 'completed')} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">Concluir</button>}
                      <button onClick={() => setEditingService(s)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">Editar</button>
                      <button onClick={() => handleDeleteService(s._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {user?.type === 'client' && (
          <>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4">Meus Serviços Contratados</h2>
              <div className="space-y-4">
                {services.map(s => {
                  const hasReviewed = reviews.some(r => r.serviceId?._id === s._id || r.serviceId === s._id);
                  return (
                    <div key={s._id} className="mb-4">
                      <div className="p-4 border rounded flex justify-between items-center bg-gray-50">
                        <div>
                          <div className="font-bold">{s.title}</div>
                          <div className="text-sm text-gray-500">Provedor: {s.providerId?.name || 'N/A'} | Status: {s.status}</div>
                        </div>
                        {s.status === 'completed' && !hasReviewed && (
                          <button 
                            onClick={() => setReviewingServiceId(reviewingServiceId === s._id ? null : s._id)} 
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold"
                          >
                            {reviewingServiceId === s._id ? 'Cancelar' : 'Avaliar'}
                          </button>
                        )}
                      </div>
                      {reviewingServiceId === s._id && (
                        <div className="mt-4">
                          <ReviewForm 
                            serviceId={s._id} 
                            onReviewSuccess={() => {
                              setReviewingServiceId(null);
                              fetchData();
                            }} 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4">Minhas Avaliações</h2>

              {editingReview && (
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded">
                  <h3 className="font-bold mb-2">Editar Avaliação</h3>
                  <form onSubmit={handleUpdateReview} className="flex gap-4 flex-wrap">
                    <input type="number" min="0" max="10" value={editingReview.score} onChange={e => setEditingReview({...editingReview, score: e.target.value})} className="border p-2 rounded w-24" />
                    <input type="text" value={editingReview.comment} onChange={e => setEditingReview({...editingReview, comment: e.target.value})} className="border p-2 rounded flex-1" />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Salvar</button>
                    <button type="button" onClick={() => setEditingReview(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r._id} className="p-4 border rounded flex justify-between items-center bg-gray-50">
                    <div>
                      <div className="font-bold">Nota: {r.score}/10</div>
                      <div className="text-sm text-gray-500">Serviço: {r.serviceId?.title || 'N/A'} | Comentário: {r.comment}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingReview(r)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">Editar</button>
                      <button onClick={() => handleDeleteReview(r._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold">Excluir</button>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-500">Você ainda não avaliou nenhum serviço.</p>}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
