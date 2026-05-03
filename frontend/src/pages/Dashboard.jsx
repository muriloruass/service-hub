import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
  const [availableServices, setAvailableServices] = useState([]);
  const [newAvailableService, setNewAvailableService] = useState({ title: '', description: '', price: '' });
  const [editingAvailableService, setEditingAvailableService] = useState(null);

  // Form states for Provider
  const [newService, setNewService] = useState({ title: '', description: '', price: '', executionDate: '', clientId: '' });
  const [editingService, setEditingService] = useState(null);

  // Form states for Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewingServiceId, setReviewingServiceId] = useState(null);

  const fetchData = async () => {
    try {
      if (user.type === 'provider') {
        const [npsRes, servicesRes, clientsRes, availableRes, reviewsRes] = await Promise.all([
          api.get('/nps'),
          api.get('/services'),
          api.get('/auth/clients'),
          api.get('/available-services/my-services'),
          api.get('/reviews')
        ]);
        setData(npsRes.data);
        setServices(servicesRes.data.filter(s => s.providerId?._id === user.id));
        setClients(clientsRes.data);
        setAvailableServices(availableRes.data || []);
        setReviews(reviewsRes.data.filter(r => r.providerId?._id === user.id));
      } else {
        const [servicesRes, reviewsRes] = await Promise.all([
          api.get('/services'),
          api.get('/reviews')
        ]);
        setServices(servicesRes.data.filter(s => s.clientId?._id === user.id));
        setReviews(reviewsRes.data.filter(r => r.clientId?._id === user.id));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  // Provider: Create Performed Service
  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.clientId) {
      toast.error('Please select a client');
      return;
    }
    if (!newService.title || !newService.price || !newService.executionDate) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const res = await api.post('/services', newService);
      setServices([...services, res.data]);
      setNewService({ title: '', description: '', price: '', executionDate: '', clientId: '' });
      toast.success('Service registered successfully!');
      fetchData();
    } catch (err) {
      toast.error('Error creating service');
    }
  };

  // Provider: Create Available Service
  const handleCreateAvailableService = async (e) => {
    e.preventDefault();
    if (!newAvailableService.title || !newAvailableService.price) {
      toast.error('Title and price are required');
      return;
    }
    try {
      const res = await api.post('/available-services', newAvailableService);
      setAvailableServices([...availableServices, res.data]);
      setNewAvailableService({ title: '', description: '', price: '' });
      toast.success('Service added to marketplace!');
    } catch (err) {
      toast.error('Error adding service');
    }
  };

  const handleUpdateAvailableService = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/available-services/${editingAvailableService._id}`, editingAvailableService);
      setAvailableServices(availableServices.map(s => s._id === editingAvailableService._id ? res.data : s));
      setEditingAvailableService(null);
      toast.success('Service updated!');
    } catch (err) {
      toast.error('Error updating service');
    }
  };

  const handleDeleteAvailableService = async (id) => {
    try {
      await api.delete(`/available-services/${id}`);
      setAvailableServices(availableServices.filter(s => s._id !== id));
      toast.success('Service removed from marketplace');
    } catch (err) {
      toast.error('Error deleting service');
    }
  };

  // Provider: Update Performed Service
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/services/${editingService._id}`, editingService);
      setServices(services.map(s => s._id === editingService._id ? res.data : s));
      setEditingService(null);
      toast.success('Service updated!');
      fetchData();
    } catch (err) {
      toast.error('Error updating service');
    }
  };

  // Provider: Update Status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/services/${id}/status`, { status });
      setServices(services.map(s => s._id === id ? res.data : s));
      toast.success('Status updated!');
      fetchData();
    } catch (err) {
      toast.error('Invalid status transition');
    }
  };

  // Provider: Delete Performed Service
  const handleDeleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
      toast.success('Service deleted!');
      fetchData();
    } catch (err) {
      toast.error('Error deleting service');
    }
  };

  // Get review status for a service
  const getReviewStatus = (serviceId) => {
    const hasReview = reviews.some(r => r.serviceId?._id === serviceId || r.serviceId === serviceId);
    if (hasReview) return { text: 'Reviewed', color: 'text-green-600', bg: 'bg-green-100' };
    return { text: 'Awaiting Review', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Welcome, {user?.name}</h1>
            <p className="text-gray-500">Dashboard ({user?.type})</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/profile"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
            >
              My Profile
            </Link>
            <Link
              to="/marketplace"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Browse Marketplace
            </Link>
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition">
              Logout
            </button>
          </div>
        </header>

        {/* Resto do código igual... */}
        {user?.type === 'provider' && (
          <>
            {/* NPS Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Your Net Promoter Score (NPS)</h2>
              <div className="flex gap-8 items-center">
                <div className="text-5xl font-black text-blue-600">{data?.nps || 0}</div>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <span className="text-green-600">Promoters: {data?.promoters || 0}</span>
                  <span className="text-yellow-600">Passives: {data?.passives || 0}</span>
                  <span className="text-red-600">Detractors: {data?.detractors || 0}</span>
                </div>
              </div>
            </div>

            {/* Reviews Received from Clients */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Reviews Received from Clients</h2>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r._id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="font-bold text-gray-800">Score: {r.score}/10</div>
                    <div className="text-sm text-gray-500">
                      Service: {r.serviceId?.title || 'N/A'} | Client: {r.clientId?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Comment: {r.comment}</div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No reviews received yet.</p>
                )}
              </div>
            </div>

            {/* Manage Services Offered */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Services Offered</h2>
              <p className="text-gray-500 mb-4">These services will appear on the Marketplace for clients to hire</p>
              
              <form onSubmit={handleCreateAvailableService} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="Service Title" 
                    required 
                    value={newAvailableService.title} 
                    onChange={e => setNewAvailableService({...newAvailableService, title: e.target.value})} 
                    className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Description" 
                    value={newAvailableService.description} 
                    onChange={e => setNewAvailableService({...newAvailableService, description: e.target.value})} 
                    className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Price (R$)" 
                    required 
                    value={newAvailableService.price} 
                    onChange={e => setNewAvailableService({...newAvailableService, price: e.target.value})} 
                    className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">
                  + Add Service to Marketplace
                </button>
              </form>

              {editingAvailableService && (
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h3 className="font-bold mb-2 text-gray-800">Edit Service</h3>
                  <form onSubmit={handleUpdateAvailableService} className="space-y-3">
                    <input type="text" value={editingAvailableService.title} onChange={e => setEditingAvailableService({...editingAvailableService, title: e.target.value})} className="border p-2 rounded w-full" />
                    <input type="text" value={editingAvailableService.description} onChange={e => setEditingAvailableService({...editingAvailableService, description: e.target.value})} className="border p-2 rounded w-full" />
                    <input type="number" value={editingAvailableService.price} onChange={e => setEditingAvailableService({...editingAvailableService, price: e.target.value})} className="border p-2 rounded w-full" />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Save</button>
                      <button type="button" onClick={() => setEditingAvailableService(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Offered Services</h3>
                {availableServices.map(s => (
                  <div key={s._id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                    <div>
                      <div className="font-bold text-gray-800">{s.title} - R$ {s.price}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingAvailableService(s)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">Edit</button>
                      <button onClick={() => handleDeleteAvailableService(s._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold">Remove</button>
                    </div>
                  </div>
                ))}
                {availableServices.length === 0 && <p className="text-gray-500 text-center py-4">No services offered yet.</p>}
              </div>
            </div>

            {/* Register Performed Services */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Register Performed Service</h2>
              <p className="text-gray-500 mb-4">Register a service you performed for a specific client</p>
              
              <form onSubmit={handleCreateService} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Service Title *" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="number" placeholder="Price (R$) *" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="date" required value={newService.executionDate} onChange={e => setNewService({...newService, executionDate: e.target.value})} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <select required value={newService.clientId} onChange={e => setNewService({...newService, clientId: e.target.value})} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Client *</option>
                    {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                  </select>
                  <textarea placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="border p-3 rounded-lg md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" />
                </div>
                <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">+ Register Performed Service</button>
              </form>

              {editingService && (
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h3 className="font-bold mb-2 text-gray-800">Edit Performed Service</h3>
                  <form onSubmit={handleUpdateService} className="space-y-3">
                    <input type="text" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="border p-2 rounded w-full" />
                    <input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} className="border p-2 rounded w-full" />
                    <textarea value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="border p-2 rounded w-full" rows="2" />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Save</button>
                      <button type="button" onClick={() => setEditingService(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Performed Services</h3>
                {services.map(s => {
                  const reviewStatus = getReviewStatus(s._id);
                  return (
                    <div key={s._id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-bold text-gray-800">{s.title} - R$ {s.price}</div>
                          <div className="text-sm text-gray-500">Client: {s.clientId?.name || 'N/A'} | Date: {new Date(s.executionDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500 mt-1">Description: {s.description || 'No description'}</div>
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reviewStatus.bg} ${reviewStatus.color}`}>{reviewStatus.text}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${s.status === 'completed' ? 'bg-green-100 text-green-600' : s.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>Status: {s.status}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {s.status === 'scheduled' && <button onClick={() => handleStatusChange(s._id, 'completed')} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">Mark Completed</button>}
                          <button onClick={() => setEditingService(s)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">Edit</button>
                          <button onClick={() => handleDeleteService(s._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {services.length === 0 && <p className="text-gray-500 text-center py-4">No performed services registered yet.</p>}
              </div>
            </div>
          </>
        )}

        {user?.type === 'client' && (
          <>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">My Hired Services</h2>
              <div className="space-y-4">
                {services.map(s => {
                  const hasReviewed = reviews.some(r => r.serviceId?._id === s._id || r.serviceId === s._id);
                  return (
                    <div key={s._id} className="mb-4">
                      <div className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                        <div>
                          <div className="font-bold text-gray-800">{s.title} - R$ {s.price}</div>
                          <div className="text-sm text-gray-500">Provider: {s.providerId?.name || 'N/A'} | Date: {new Date(s.executionDate).toLocaleDateString()} | Status: <span className={`ml-1 font-semibold ${s.status === 'completed' ? 'text-green-600' : s.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{s.status}</span></div>
                        </div>
                        {s.status === 'completed' && !hasReviewed && <button onClick={() => setReviewingServiceId(reviewingServiceId === s._id ? null : s._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">{reviewingServiceId === s._id ? 'Cancel' : 'Write Review'}</button>}
                      </div>
                      {reviewingServiceId === s._id && (
                        <div className="mt-4">
                          <ReviewForm serviceId={s._id} onReviewSuccess={() => { setReviewingServiceId(null); fetchData(); }} />
                        </div>
                      )}
                    </div>
                  );
                })}
                {services.length === 0 && <p className="text-gray-500 text-center py-4">No services hired yet.</p>}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">My Reviews</h2>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r._id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="font-bold text-gray-800">Score: {r.score}/10</div>
                    <div className="text-sm text-gray-500">Service: {r.serviceId?.title || 'N/A'} | Comment: {r.comment}</div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-500 text-center py-4">You haven't reviewed any services yet.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;