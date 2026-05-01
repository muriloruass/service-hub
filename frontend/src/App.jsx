import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';

const SocketListener = () => {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.on('service_completed', (data) => {
      toast(`✅ Serviço "${data.title}" foi concluído!`, { duration: 5000 });
    });

    socket.on('new_review', (data) => {
      toast(`⭐ Nova avaliação de nota ${data.score} recebida!`, { duration: 5000 });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <SocketListener />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
