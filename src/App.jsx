import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { PermissionsProvider } from './context/PermissionsContext';
import { ThemeProvider } from './context/ThemeContext'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RecoverPass from './pages/RecoverPass/RecoverPass';
import Profile from './pages/Profile/Profile';
import FAQ from './pages/FAQ/FAQ';
import About from './pages/About/About';
import Admin from './pages/Admin/Admin';
import Event from './pages/Event/Event';
import EventosPage from './pages/EventosPage/EventosPage';
import EventList from './pages/EventList/EventList.jsx';
import EditarEvento from './pages/EditarEvento/EditarEvento';
import ConfigPermissoes from './pages/ConfigPermissoes/ConfigPermissoes';
import GerenciamentoUsuarios from './pages/GerenciamentoUsuarios/GerenciamentoUsuarios';
import VerificarRegistro from './pages/VerificarRegistro/VerificarRegistro';
import CriarEvento from './components/CriarEvento/CriarEvento';
import RegistrarOrganizacao from './components/RegistrarOrganizacao/RegistrarOrganizacao';
import EditarOrganizacao from './components/EditarOrganizacao/EditarOrganizacao.jsx';
import VolunteerList from './components/VolunteerList/VolunteerList.jsx';

function App() {
  const [eventos, setEventos] = useState([]);

  const buscarEventoPorId = (id) => {
    return eventos.find(evento => evento.id === id);
  };

  const handleAddVolunteer = (novoVoluntario) => {
    console.log('Voluntário adicionado:', novoVoluntario);
  };

  return (
    <AuthProvider>
      <PermissionsProvider>
        <ThemeProvider> 
          <Router>
            <Navbar />
            <div className="container-flui">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recoverpass" element={<RecoverPass />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/event/:id" element={<Event />} />
                <Route path="/eventos" element={<EventosPage eventos={eventos} setEventos={setEventos} />} />
                <Route path="/eventlist" element={<EventList />} />
                <Route path="/editar-evento/:id" element={<EditarEvento eventoAtual={buscarEventoPorId} />} />
                <Route path="/config-permissoes" element={<ConfigPermissoes />} />
                <Route path="/gerenciar-usuarios" element={<GerenciamentoUsuarios />} />
                <Route path="/verificar-registro" element={<VerificarRegistro />} />
                <Route path="/criar-evento" element={<CriarEvento />} />
                <Route path="/registrar-organizacao" element={<RegistrarOrganizacao />} />
                <Route path="/editar-organizacao/:id" element={<EditarOrganizacao />} />
                <Route path="/volunteers" element={<VolunteerList />} />
              </Routes>
            </div>
            <Footer />
          </Router>
        </ThemeProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;
