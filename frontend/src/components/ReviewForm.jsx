import { useState } from 'react';
import api from '../services/api';

const ReviewForm = ({ serviceId, onReviewSuccess }) => {
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/reviews', {
        serviceId,
        score: rating,
        comment
      });
      setMessage({ type: 'success', text: 'Avaliação enviada com sucesso!' });
      if (onReviewSuccess) onReviewSuccess();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Erro ao enviar avaliação.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Avaliar Serviço</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            De 0 a 10, qual a probabilidade de você nos recomendar?
          </label>
          <div className="flex flex-wrap gap-2">
            {[...Array(11).keys()].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  rating === num 
                    ? 'bg-blue-600 text-white scale-110 shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Muito Improvável</span>
            <span>Muito Provável</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conte-nos mais (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            rows="3"
            placeholder="O que você achou do serviço?"
          ></textarea>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
        >
          {loading ? 'Enviando...' : 'Confirmar Avaliação'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
