import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Event from './pages/Event/Event';
import About from './pages/About/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from './pages/Profile/Profile';
import RecoverPass from './pages/RecoverPass/RecoverPass';
import FAQ from './pages/FAQ/FAQ';
import EventList from './pages/EventList/EventList.jsx';
import Admin from './pages/Admin/Admin';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Adiciona a rota para Register */}
          <Route path="/home" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/about" element={<About />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/foteer" element={<Footer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recoverpass" element={<RecoverPass />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/eventlist" element={<EventList />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;