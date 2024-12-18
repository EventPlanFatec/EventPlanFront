import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { PermissionsProvider } from './context/PermissionsContext';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { CartProvider } from './context/CartContext';
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
import ConfigPermissoes from './pages/ConfigPermissoes/ConfigPermissoes';
import GerenciamentoUsuarios from './pages/GerenciamentoUsuarios/GerenciamentoUsuarios';
import VerificarRegistro from './pages/VerificarRegistro/VerificarRegistro';
import CriarEvento from '../src/pages/EventoCriacao/EventoCriacao';
import RegistrarOrganizacao from './components/RegistrarOrganizacao/RegistrarOrganizacao';
import CartPage from './pages/CartPage/CartPage';
import PagamentoPage from './pages/PagamentoPage/PagamentoPage.jsx';
import FinalizarPagamentoPage from './pages/FinalizarPagamentoPage/FinalizarPagamentoPage.jsx';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import EventosAdminPage from './pages/EventosGerenciamento/EventosAdminPage.jsx';
import PerfilUsuario from './pages/PerfilUsuario/PerfilUsuario';
import PerfilOrganizacao from './pages/PerfilOrganizacao/PerfilOrganizacao';
import PerfilAdm from './pages/PerfilAdm/PerfilAdm';
import EventosGerenciamento from "./pages/EventosGerenciamento/EventosGerenciamento.jsx";
import IngressoCriacao from './pages/IngressoCriacao/IngressoCriacao.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import EventosEncontrados from './pages/EventosEncontrados/EventosEncontrados.jsx';
import UsuarioIngresso from './pages/UsuarioIngresso/UsuarioIngresso.jsx';
import EditarEvento from './pages/EditarEvento/EditarEvento';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadAnuncio from './components/Anuncios/UploadAnuncio.jsx';
import IngressoForm from './components/IngressoForm/IngressoForm.jsx';


function App() {
  const [eventos, setEventos] = useState([
    { id: 1, name: 'Concerto de Rock', type: 'show', location: 'sp', price: 50 },
    { id: 2, name: 'Workshop de React', type: 'curso', location: 'rj', price: 100 },
    { id: 3, name: 'Webinar sobre Desenvolvimento Web', type: 'comedia', location: 'br', price: 0 },
    { id: 4, name: 'Competição de Games', type: 'games', location: 'bh', price: 150 },
  ]);

  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : null;
  });

  const handlePreferencesSubmit = (newPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('preferences', JSON.stringify(newPreferences));
  };

  const filteredEvents = () => {
    if (!preferences) return eventos;
    return eventos.filter(event => {
      return (
        (!preferences.eventType || preferences.eventType === 'todos' || event.type === preferences.eventType) &&
        (!preferences.location || event.location === preferences.location) &&
        (preferences.priceRange === '0-50' ? event.price <= 50 :
         preferences.priceRange === '51-100' ? event.price > 50 && event.price <= 100 :
         preferences.priceRange === '101-200' ? event.price > 100 && event.price <= 200 :
         preferences.priceRange === '201-500' ? event.price > 200 && event.price <= 500 :
         preferences.priceRange === '500+' ? event.price > 500 : true)
      );
    });
  };

  const notifySuccess = () => toast.success("Evento criado com sucesso!");

  return (
    <AuthProvider>
      <PermissionsProvider>
        <ThemeProvider>
          <PreferencesProvider>
            <CartProvider>
              <Router>
                <Navbar />
                <div className="container-flui">
                  <Routes>
                    <Route path="/" element={<Home eventos={filteredEvents()} />} />
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
                    <Route path="/config-permissoes" element={<ConfigPermissoes />} />
                    <Route path="/gerenciar-usuarios" element={<GerenciamentoUsuarios />} />
                    <Route path="/verificar-registro" element={<VerificarRegistro />} />
                    <Route path="/create-event" element={<CriarEvento />} />
                    <Route path="/registrar-organizacao" element={<RegistrarOrganizacao />} />
                    <Route path="/carrinho" element={<CartPage />} />
                    <Route path="/pagamento" element={<PagamentoPage />} />
                    <Route path="/finalizar-pagamento" element={<FinalizarPagamentoPage />} />
                    <Route path="/inventario" element={<InventoryPage eventos={eventos} />} />
                    <Route path="gerenciamento-eventos" element={<EventosAdminPage />} />
                    <Route path="/PerfilUsuario" element={<PerfilUsuario />} />
                    <Route path="/PerfilOrganizacao" element={<PerfilOrganizacao />} />
                    <Route path="/PerfilAdm" element={<PerfilAdm />} />
                    <Route path="/manage-events" element={<EventosGerenciamento />} />
                    <Route path="/criar-ingresso" element={<IngressoCriacao />} />
                    <Route path="/" element={<SearchBar />} />
                    <Route path="/eventos-encontrados" element={<EventosEncontrados />} />
                    <Route path="/my-tickets" element={<UsuarioIngresso />} />
                    <Route path="/editar-evento/:id" element={<EditarEvento />} />
                    <Route path="/upload-anuncio" element={<UploadAnuncio />} />
                    <Route path="/ingresso-form" element={<IngressoForm />} />
                  </Routes>
                </div>
                <Footer />
              </Router>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
                newestOnTop
              />
            </CartProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;
