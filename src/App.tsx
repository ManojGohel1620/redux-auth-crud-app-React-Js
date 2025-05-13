import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Crud from './pages/Crud';
import { useAppSelector } from './hooks';

const App: React.FC = () => {
  const token = useAppSelector(state => state.auth.token);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={token ? <Products /> : <Navigate to="/login" replace />} />
        <Route path="/crud" element={token ? <Crud /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;