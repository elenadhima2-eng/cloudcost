import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
 
export default function Login() {
  const [form,    setForm]    = useState({ email: '', fjalekalimi: '' });
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('emri', res.data.emri);
      localStorage.setItem('roli', res.data.roli);
      localStorage.setItem('limit', res.data.limit || 0);
      navigate('/dashboard');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Gabim!');
    }
    setLoading(false);
  };
 
  return (
    <div style={st.page}>
      <div style={st.box}>
        <div style={st.logoWrap}>
          <div style={st.logo}><img src="/LOGOJAA.png" alt="CloudCost" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></div>
          <h2 style={st.title}>CloudCost</h2>
          <p style={st.subtitle}>Hyr në platformë</p>
        </div>
 
        <form onSubmit={handleSubmit}>
          <div style={st.group}>
            <label style={st.label}>Email</label>
            <input
              style={st.input}
              name="email"
              type="email"
              placeholder="email@kompania.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
 
          <div style={st.group}>
            <label style={st.label}>Fjalëkalimi</label>
            <input
              style={st.input}
              name="fjalekalimi"
              type="password"
              placeholder="Fjalëkalimi juaj"
              value={form.fjalekalimi}
              onChange={handleChange}
              required
            />
          </div>
 
          {msg && (
            <div style={st.errorBox}>
              ⚠️ {msg}
            </div>
          )}
 
          <button style={{ ...st.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? '⏳ Duke hyrë...' : '🔐 Hyr'}
          </button>
        </form>
 
        <p style={st.linkRow}>
          Nuk ke llogari?{' '}
          <Link to="/register" style={{ color: '#4361ee', fontWeight: '600', textDecoration: 'none' }}>
            Regjistrohu
          </Link>
        </p>
      </div>
    </div>
  );
}
 
const st = {
  page:     { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff, #f8f9fc)', fontFamily: 'sans-serif' },
  box:      { background: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(67,97,238,0.12)' },
  logoWrap: { textAlign: 'center', marginBottom: '32px' },
  logo:     { width: '56px', height: '56px', background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '12px' },
  title:    { margin: '0 0 4px', color: '#1a1a2e', fontSize: '24px', fontWeight: '800' },
  subtitle: { margin: 0, color: '#6b7280', fontSize: '14px' },
  group:    { marginBottom: '16px' },
  label:    { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' },
  input:    { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '16px', textAlign: 'center' },
  btn:      { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' },
  linkRow:  { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }
};
