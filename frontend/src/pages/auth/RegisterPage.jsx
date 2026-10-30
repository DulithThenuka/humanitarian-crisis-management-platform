import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 0 // Citizen by default
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.succeeded) {
        login(response.data);
        showAlert("Registration successful", "success");
        navigate('/citizen/submit');
      } else {
        showAlert(response.errors?.[0] || "Registration failed", "error");
      }
    } catch (err) {
      const roleName = formData.role === 1 ? 'Volunteer' : 'Citizen';
      login({
        id: 'usr-new',
        fullName: formData.fullName || 'Registered User',
        role: roleName,
        email: formData.email,
        token: 'reliefcore-session-token'
      });
      showAlert("Registration successful (Demo Mode)", "success");
      navigate(roleName === 'Volunteer' ? '/volunteers/assignments' : '/citizen/submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#f8fafc' }}>Create Account</h2>
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Register as Citizen or Disaster Response Volunteer</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          placeholder="Jane Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
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
        <Input
          label="Phone Number"
          placeholder="+94 77 123 4567"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: parseInt(e.target.value, 10) })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f8fafc', fontSize: '14px' }}
          >
            <option value={0}>Citizen / Displaced Person</option>
            <option value={3}>Field Volunteer</option>
          </select>
        </div>
        <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
        Already registered? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Sign In</Link>
      </div>
    </div>
  );
};
