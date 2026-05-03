import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ReviewForm = ({ serviceId, onReviewSuccess }) => {
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!score || score < 0 || score > 10) {
      toast.error('Please enter a valid score between 0 and 10');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/reviews', {
        serviceId,
        score: parseInt(score),
        comment
      });
      
      toast.success('Review submitted successfully!');
      setScore('');
      setComment('');
      
      if (onReviewSuccess) {
        onReviewSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Score (0 to 10)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 8"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            0-10 scale: 0=Very Bad, 5=Average, 10=Excellent
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Share your experience with this service..."
            required
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={() => {
              setScore('');
              setComment('');
              if (onReviewSuccess) onReviewSuccess();
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;