import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const emri     = localStorage.getItem('emri');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('emri');
    navigate('/login');
  };
  <button style={styles.profileBtn} onClick={() => navigate('/profile')}>
  👤 Profili
</button>
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}><img src="/logo.png" alt="CloudCost" style={{ width: '28px', height: '28px', objectFit: 'contain' }} /></h2>
      <div style={styles.right}>
        <span style={styles.emri}>👋 {emri}</span>
        <button style={styles.btn} onClick={logout}>Dil</button>
      </div>
    </nav>
  );
}

const styles = {
  nav:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 32px', background:'#1a1a2e', color:'white' },
  logo:  { margin:0, color:'white' },
  right: { display:'flex', alignItems:'center', gap:'16px' },
  emri:  { color:'#a8b2d8' },
  btn:   { padding:'8px 16px', background:'#ef233c', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
profileBtn: { padding: '6px 14px', background: '#f0f4ff', color: '#4361ee', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
};