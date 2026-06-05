import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
 
export default function Register() {
  const [form, setForm] = useState({
    emri: '', email: '', fjalekalimi: '', konfirmo: '', roli: 'punonjës'
  });
  const [msg,     setMsg]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const kushtet = [
    { tekst: 'Të paktën 8 karaktere',            ok: form.fjalekalimi.length >= 8 },
    { tekst: 'Të paktën 1 shkronjë e madhe (A-Z)', ok: /[A-Z]/.test(form.fjalekalimi) },
    { tekst: 'Të paktën 1 numër (0-9)',            ok: /[0-9]/.test(form.fjalekalimi) },
    { tekst: 'Fjalëkalimet përputhen',             ok: form.fjalekalimi && form.fjalekalimi === form.konfirmo }
  ];
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
 
    if (form.fjalekalimi.length < 8)          return setMsg('Fjalëkalimi duhet të ketë të paktën 8 karaktere');
    if (!/[A-Z]/.test(form.fjalekalimi))      return setMsg('Fjalëkalimi duhet të ketë të paktën 1 shkronjë të madhe');
    if (!/[0-9]/.test(form.fjalekalimi))      return setMsg('Fjalëkalimi duhet të ketë të paktën 1 numër');
    if (form.fjalekalimi !== form.konfirmo)   return setMsg('Fjalëkalimet nuk përputhen');
 
    setLoading(true);
    try {
      await register({
        emri:        form.emri,
        email:       form.email,
        fjalekalimi: form.fjalekalimi,
        roli:        form.roli
      });
      setSuccess(true);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Gabim!');
    }
    setLoading(false);
  };
 
  if (success) {
    return (
      <div style={st.page}>
        <div style={{ ...st.box, textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📧</div>
          <h2 style={{ color: '#1a1a2e', marginBottom: '12px' }}>Kontrollo Email-in!</h2>
          <p style={{ color: '#6b7280', lineHeight: '1.7', marginBottom: '24px' }}>
            Një email verifikimi u dërgua te <strong>{form.email}</strong>.<br />
            Kliko linkun në email për të aktivizuar llogarinë.
          </p>
          <button style={st.btn} onClick={() => navigate('/login')}>
            🔐 Shko te Login
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div style={st.page}>
      <div style={st.box}>
        <div style={st.logoWrap}>
          <div style={st.logo}><img src="/LOGOJAA.png" alt="CloudCost" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></div>
          <h2 style={st.title}>CloudCost</h2>
          <p style={st.subtitle}>Krijo llogari të re</p>
        </div>
 
        <form onSubmit={handleSubmit}>
 
          {/* EMRI */}
          <div style={st.group}>
            <label style={st.label}>Emri i Startup-it</label>
            <input
              style={st.input}
              name="emri"
              placeholder="p.sh. TechAlb"
              value={form.emri}
              onChange={handleChange}
              required
            />
          </div>
 
          {/* EMAIL */}
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
 
          {/* ROLI */}
          <div style={st.group}>
            <label style={st.label}>Zgjidh Rolin</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { val: 'punonjes', icon: '👤', emri: 'Punonjës', pershkrim: 'Sheh kostot dhe analizat' },
                { val: 'admin',    icon: '👑', emri: 'Admin',    pershkrim: 'Akses i plotë + Backup' }
              ].map(r => (
                <div
                  key={r.val}
                  onClick={() => setForm({ ...form, roli: r.val })}
                  style={{
                    padding: '16px 12px',
                    border: form.roli === r.val ? '2px solid #4361ee' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: form.roli === r.val ? '#f0f4ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{r.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e', marginBottom: '4px' }}>{r.emri}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{r.pershkrim}</div>
                </div>
              ))}
            </div>
          </div>
 
          {/* FJALEKALIMI */}
          <div style={st.group}>
            <label style={st.label}>Fjalëkalimi</label>
            <input
              style={st.input}
              name="fjalekalimi"
              type="password"
              placeholder="Minimum 8 karaktere"
              value={form.fjalekalimi}
              onChange={handleChange}
              required
            />
            {form.fjalekalimi && (
              <div style={{ marginTop: '8px', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px' }}>
                {kushtet.map((k, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: i < kushtet.length - 1 ? '4px' : 0 }}>
                    <span style={{ fontSize: '12px' }}>{k.ok ? '✅' : '❌'}</span>
                    <span style={{ fontSize: '12px', color: k.ok ? '#22c55e' : '#ef4444' }}>{k.tekst}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          {/* KONFIRMO */}
          <div style={st.group}>
            <label style={st.label}>Konfirmo Fjalëkalimin</label>
            <input
              style={{
                ...st.input,
                borderColor: form.konfirmo
                  ? form.fjalekalimi === form.konfirmo ? '#22c55e' : '#ef4444'
                  : '#e5e7eb'
              }}
              name="konfirmo"
              type="password"
              placeholder="Përsërit fjalëkalimin"
              value={form.konfirmo}
              onChange={handleChange}
              required
            />
          </div>
 
          {msg && (
            <div style={st.errorBox}>⚠️ {msg}</div>
          )}
 
          <button style={{ ...st.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? '⏳ Duke regjistruar...' : '🚀 Regjistrohu'}
          </button>
        </form>
 
        <p style={st.linkRow}>
          Ke llogari?{' '}
          <Link to="/login" style={{ color: '#4361ee', fontWeight: '600', textDecoration: 'none' }}>
            Hyr këtu
          </Link>
        </p>
      </div>
    </div>
  );
}
 
const st = {
  page:     { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff, #f8f9fc)', fontFamily: 'sans-serif', padding: '20px' },
  box:      { background: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(67,97,238,0.12)' },
  logoWrap: { textAlign: 'center', marginBottom: '28px' },
  logo:     { width: '56px', height: '56px', background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '12px' },
  title:    { margin: '0 0 4px', color: '#1a1a2e', fontSize: '24px', fontWeight: '800' },
  subtitle: { margin: 0, color: '#6b7280', fontSize: '14px' },
  group:    { marginBottom: '16px' },
  label:    { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' },
  input:    { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', color: '#dc2626', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  btn:      { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' },
  linkRow:  { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }
};