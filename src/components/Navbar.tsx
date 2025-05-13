import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logout } from '../features/auth/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(state => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkStyle = {
    marginRight: '1rem',
    textDecoration: 'none',
    color: 'black',
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      {token ? (
        <>
          <Link to="/products" style={linkStyle}>Products</Link>
          <Link to="/crud" style={linkStyle}>CRUD</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={{ ...linkStyle, marginRight: 0 }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
