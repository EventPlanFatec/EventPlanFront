import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
import './fontawesome.jsx';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Event from './pages/Event/Event';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CssBaseline } from '@mui/material';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
}

function AppContent() {
    const { darkMode } = useTheme();

    return (
        <BrowserRouter>
            <div className={darkMode ? 'dark-mode' : 'light-mode'}>
                <CssBaseline />
                <Navbar />
                <div className="container-fluid">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/event/:id" element={<Event />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
