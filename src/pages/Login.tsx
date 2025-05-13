import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginUser } from '../features/auth/authSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(res)) navigate('/products');
  };

  return (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f9f9f9',
    }}
  >
    <div
      style={{
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
        minWidth: '300px',
      }}
    >
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />

        <input
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  </div>
);

};

export default Login;