import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import EventosPage from './pages/EventosPage/EventosPage';
import EventList from './pages/EventList/EventList.jsx';
import CriarEvento from './components/CriarEvento/CriarEvento';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/eventlist" element={<EventList />} />
          <Route path="/criar-evento" element={<CriarEvento />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
