import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { PermissionsProvider } from './context/PermissionsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import EventosPage from './pages/EventosPage/EventosPage';
import EventList from './pages/EventList/EventList.jsx';
import EditarEvento from './pages/EditarEvento/EditarEvento';
import ConfigPermissoes from './pages/ConfigPermissoes/ConfigPermissoes';
import GerenciamentoUsuarios from './pages/GerenciamentoUsuarios/GerenciamentoUsuarios';
import CriarEvento from './components/CriarEvento/CriarEvento';
import RegistrarOrganizacao from './components/RegistrarOrganizacao/RegistrarOrganizacao';
import EditarOrganizacao from './components/EditarOrganizacao/EditarOrganizacao.jsx';

function App() {
  const [eventos, setEventos] = useState([]);

  const buscarEventoPorId = (id) => {
    return eventos.find(evento => evento.id === id);
  };

  return (
    <AuthProvider>
      <PermissionsProvider>
      <Router>
        <Navbar />
        <div className="container-flui">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/eventos" element={<EventosPage eventos={eventos} setEventos={setEventos} />} />
          <Route path="/eventlist" element={<EventList />} />
          <Route path="/editar-evento/:id" element={<EditarEvento eventoAtual={buscarEventoPorId} />} />
          <Route path="/config-permissoes" element={<ConfigPermissoes />} />
          <Route path="/gerenciar-usuarios" element={<GerenciamentoUsuarios />} />
          <Route path="/criar-evento" element={<CriarEvento />} />
          <Route path="/registrar-organizacao" element={<RegistrarOrganizacao />} />
          <Route path="/editar-organizacao/:id" element={<EditarOrganizacao />} />
        </Routes>
        </div>
        <Footer />
      </Router>
      </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;
