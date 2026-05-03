import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/available-services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleHireClick = (service) => {
    setSelectedService(service);
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">Service Marketplace</h1>
          <p className="text-gray-600 mt-2">Find the best professionals for your project</p>
        </header>

        {services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      Available Now
                    </span>
                    <span className="text-2xl font-bold text-blue-600">R$ {service.price}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Provider</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {service.providerId?.name || 'Unavailable'}
                      </p>
                    </div>
                    
                    {user && user.type === 'client' && (
                      <button 
                        onClick={() => handleHireClick(service)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        Hire Now
                      </button>
                    )}
                    
                    {!user && (
                      <div className="text-xs text-gray-400">
                        Login to hire
                      </div>
                    )}
                    
                    {user && user.type === 'provider' && (
                      <div className="text-xs text-gray-400">
                        Providers can't hire
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Provider Modal */}
      {showConfirmModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Contact Provider</h2>
            <p className="mb-2 text-gray-700">
              You are interested in: <strong className="text-blue-600">{selectedService.title}</strong>
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Provider:</span> {selectedService.providerId?.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {selectedService.providerId?.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Phone:</span> {selectedService.providerId?.phone || 'Not provided'}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Please contact the provider directly outside the platform to hire this service.
            </p>
            <button 
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedService(null);
              }} 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;