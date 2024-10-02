import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/home" element={<Home />} /> 
        </Routes>
      </>
    </Router>
  );
}

export default App;