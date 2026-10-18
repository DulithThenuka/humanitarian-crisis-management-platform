import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(formData);
      if (response.succeeded) {
        login(response.data);
        showAlert("Login successful", "success");
        navigate('/coordinator/dashboard');
      } else {
        showAlert(response.errors?.[0] || "Invalid credentials", "error");
      }
    } catch (err) {
      showAlert(err?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#f8fafc' }}>Sign In</h2>
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Humanitarian Crisis Management Platform</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@crisisplatform.org"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </Button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
        Don't have an account? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>Register here</Link>
      </div>
    </div>
  );
};
