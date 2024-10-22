import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import EventosPage from './pages/EventosPage/EventosPage';
import EventList from './pages/EventList/EventList.jsx';
import EditarEvento from './pages/EditarEvento/EditarEvento';
import CriarEvento from './components/CriarEvento/CriarEvento';

function App() {
  const [eventos, setEventos] = useState([]);

  const buscarEventoPorId = (id) => {
    return eventos.find(evento => evento.id === id);
  };

  return (
    <AuthProvider>
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
          <Route path="/criar-evento" element={<CriarEvento />} />
        </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
