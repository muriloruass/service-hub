import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login bem-sucedido!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">Login no Service Hub</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta? <Link to="/signup" className="text-blue-600 font-bold">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
