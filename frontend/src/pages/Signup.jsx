import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('client');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password, type);
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">Cadastro</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Nome Completo" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
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
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="client">Sou Cliente</option>
            <option value="provider">Sou Fornecedor</option>
          </select>
          <button 
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta? <Link to="/login" className="text-blue-600 font-bold">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
