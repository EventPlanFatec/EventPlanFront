import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CriarEvento from './components/CriarEvento/CriarEvento';
import EventosPage from './pages/EventosPage/EventosPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Adiciona a rota para Register */}
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/criar-evento" element={<CriarEvento />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
