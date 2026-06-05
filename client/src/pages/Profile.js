import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [form,    setForm]    = useState({ emri: '', email: '' });
  const [msg,     setMsg]     = useState('');
  const [msgType, setMsgType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [profili, setProfili] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/api/auth/profil', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setForm({ emri: data.emri || '', email: data.email || '' });
      setProfili(data);
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/api/auth/profil', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Profili u përditësua me sukses!');
        setMsgType('success');
        localStorage.setItem('emri', form.emri);
      } else {
        setMsg(data.msg || 'Gabim!');
        setMsgType('error');
      }
    } catch {
      setMsg('Gabim gjatë përditësimit');
      setMsgType('error');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Jeni të sigurt? Ky veprim nuk mund të kthehet!')) return;
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/api/auth/profil', {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.clear();
        navigate('/login');
      } else {
        alert('Gabim gjatë fshirjes');
      }
    } catch { alert('Gabim gjatë fshirjes'); }
  };

  const roli = localStorage.getItem('roli') || 'punonjes';
  const emri = localStorage.getItem('emri') || '';

  return (
    <div style={s.page}>

      {/* NAVBAR MINI */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <div style={s.logo}>☁️</div>
          <span style={s.logoText}>CloudMonitor</span>
        </div>
        <div style={s.navRight}>
          <button style={s.backBtn} onClick={() => navigate('/dashboard')}>
            ← Kthehu te Dashboard
          </button>
        </div>
      </nav>

      <div style={s.content}>

        {/* HEADER PROFIL */}
        <div style={s.heroCard}>
          <div style={s.avatarLarge}>
            {emri.charAt(0).toUpperCase()}
          </div>
          <h2 style={s.heroName}>{emri}</h2>
          <span style={{
            ...s.roliBadge,
            background: roli === 'admin' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'
          }}>
            {roli === 'admin' ? '👑 Admin' : '👤 Punonjës'}
          </span>
          {profili && (
            <p style={s.heroEmail}>📧 {profili.email}</p>
          )}
        </div>

        {/* FORMA EDIT */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>✏️ Edito Profilin</h3>

          {msg && (
            <div style={{
              ...s.msgBox,
              background: msgType === 'success' ? '#f0fdf4' : '#fef2f2',
              border:     `1px solid ${msgType === 'success' ? '#86efac' : '#fecaca'}`,
              color:      msgType === 'success' ? '#166534' : '#dc2626'
            }}>
              {msgType === 'success' ? '✅' : '❌'} {msg}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div style={s.formGroup}>
              <label style={s.label}>Emri i Startup-it</label>
              <input
                type="text"
                value={form.emri}
                onChange={e => setForm({ ...form, emri: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Duke ruajtur...' : '💾 Ruaj Ndryshimet'}
            </button>
          </form>
        </div>

        {/* INFO LLOGARIA */}
        {profili && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>ℹ️ Informacione të Llogarisë</h3>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Roli</span>
              <span style={s.infoVal}>{roli === 'admin' ? '👑 Admin' : '👤 Punonjës'}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Email i Verifikuar</span>
              <span style={{ ...s.infoVal, color: profili.emailVerifikuar ? '#22c55e' : '#ef4444' }}>
                {profili.emailVerifikuar ? '✅ Po' : '❌ Jo'}
              </span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Limit Kosto</span>
              <span style={s.infoVal}>
                {profili.limitKosto > 0 ? `$${profili.limitKosto}/muaj` : 'Pa limit'}
              </span>
            </div>
            <div style={{ ...s.infoRow, borderBottom: 'none' }}>
              <span style={s.infoLabel}>Anëtar që nga</span>
              <span style={s.infoVal}>
                {profili.createdAt ? new Date(profili.createdAt).toLocaleDateString('sq-AL') : 'N/A'}
              </span>
            </div>
          </div>
        )}

        {/* ZONA E RREZIKSHME */}
        <div style={{ ...s.card, border: '1px solid #fecaca' }}>
          <h3 style={{ ...s.cardTitle, color: '#dc2626' }}>⚠️ Zona e Rrezikshme</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px', lineHeight: '1.6' }}>
            Fshirja e profilit është e pakthyeshme. Të gjitha të dhënat, konfigurimet dhe backup-et do të humbasin përgjithmonë.
          </p>
          <button
            onClick={handleDelete}
            style={s.deleteBtn}
          >
            🗑️ Fshi Profilin Përgjithmonë
          </button>
        </div>

      </div>
    </div>
  );
}

const s = {
  page:      { background: '#f8f9fc', minHeight: '100vh', fontFamily: 'sans-serif' },
  navbar:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', background: 'white', borderBottom: '1px solid #e5e7eb', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  navLeft:   { display: 'flex', alignItems: 'center', gap: '12px' },
  logo:      { width: '32px', height: '32px', background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  logoText:  { fontWeight: '700', fontSize: '16px', color: '#1a1a2e' },
  navRight:  { display: 'flex', alignItems: 'center', gap: '12px' },
  backBtn:   { padding: '7px 16px', background: '#f0f4ff', color: '#4361ee', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  content:   { padding: '32px', maxWidth: '560px', margin: '0 auto' },
  heroCard:  { background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', borderRadius: '16px', padding: '36px', marginBottom: '24px', color: 'white', textAlign: 'center' },
  avatarLarge: { width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '800', margin: '0 auto 16px', color: 'white' },
  heroName:  { margin: '0 0 8px', fontSize: '26px', fontWeight: '800', color: 'white' },
  roliBadge: { display: 'inline-block', padding: '5px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: 'white' },
  heroEmail: { margin: '12px 0 0', fontSize: '14px', opacity: 0.8, color: 'white' },
  card:      { background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  cardTitle: { margin: '0 0 20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '700' },
  msgBox:    { borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' },
  formGroup: { marginBottom: '16px' },
  label:     { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' },
  input:     { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  btn:       { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  infoRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  infoLabel: { fontSize: '14px', color: '#6b7280' },
  infoVal:   { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  deleteBtn: { padding: '11px 20px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }
};