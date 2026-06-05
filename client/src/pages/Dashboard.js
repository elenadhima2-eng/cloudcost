import { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  createStartup, getDashboard, editStartup, deleteStartup,
  uploadBackup, listBackups, deleteBackup,
  askChat, analyzeAI, anomalyAI, generateReport,
  setLimit
} from '../services/api';
 
// ========== TOAST ==========
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#4361ee' };
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
      background: 'white', border: `2px solid ${colors[type] || colors.info}`,
      borderRadius: '12px', padding: '14px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      zIndex: 9999, fontSize: '14px', color: '#1a1a2e', minWidth: '300px',
      textAlign: 'center', fontWeight: '600', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px'
    }}>
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span>{msg}</span>
    </div>
  );
};
 
// ========== MODAL EDIT ==========
const ModalEdit = ({ startup, onSave, onClose }) => {
  const [form, setForm] = useState({
    ec2Type: startup.ec2Type,
    ec2Ore: startup.ec2Ore,
    s3GB: startup.s3GB
  });
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000 }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>✏️ Edito Konfigurimin</h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>Tipi EC2</label>
          <select style={inp} value={form.ec2Type} onChange={e => setForm({ ...form, ec2Type: e.target.value })}>
            <option value="t2.micro">t2.micro — $0.0116/orë</option>
            <option value="t2.small">t2.small — $0.0230/orë</option>
            <option value="t2.medium">t2.medium — $0.0464/orë</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>Orët e Përdorimit</label>
          <input style={inp} type="number" value={form.ec2Ore} onChange={e => setForm({ ...form, ec2Ore: e.target.value })} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={lbl}>Hapësira S3 (GB)</label>
          <input style={inp} type="number" value={form.s3GB} onChange={e => setForm({ ...form, s3GB: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }} onClick={onClose}>Anulo</button>
          <button style={{ flex: 1, padding: '10px', background: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }} onClick={() => { onSave(startup._id, form); onClose(); }}>💾 Ruaj</button>
        </div>
      </div>
    </div>
  );
};
 
const lbl = { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' };
const inp = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' };
 
// ========== TRANSLATIONS ==========
const T = {
  sq: {
    overview: 'Overview', kostot: 'Kostot', backups: 'Backups', raport: 'Raport AI',
    kostoTotale: 'KOSTOJA TOTALE MUJORE', parashikim: 'Parashikim',
    backupet: 'Backup-et', anomali: 'Statusi', po: 'Anomali', jo: 'Normale',
    grafiku: 'Kostot e Shërbimeve Cloud', analize: 'Analizë AI',
    kliko: 'Kliko butonin për rekomandime nga AI', analizo: 'Analizо me AI',
    duke: 'Duke analizuar...', backupFundit: 'Backup-et e Fundit',
    shihGjithe: 'Shih të gjitha', nukKaDhena: 'Nuk ka të dhëna ende — shto konfigurim',
    nukKaBackup: 'Nuk ka backup ende', konfiguro: 'Konfiguro Shërbimet Cloud',
    tipi: 'Tipi i Serverit EC2', oret: 'Orët e Përdorimit', hapesira: 'Hapësira S3 (GB)',
    llogarit: 'Llogarit dhe Ruaj', historia: 'Historia e Konfigurimeve',
    file: 'Emri i File-it', madhesia: 'Madhësia', veprime: 'Veprime',
    ngarko: 'Ngarko Backup', fshi: 'Fshi', raportMujor: 'Raport Mujor me AI',
    gjenero: 'Gjenero Raportin', shkarko: 'Shkarko PDF',
    limit: 'Vendos Limit Kosto Mujore', limitPlaceholder: 'Limit ($)',
    vendos: 'Vendos Limitin', dil: 'Dil', ec2: 'EC2 Type', ore: 'Orë',
    s3: 'GB S3', kosto: 'Kosto/Muaj', muaji: 'Muaji', nukKaKonf: 'Nuk ka konfigurim ende',
    kostotNormale: 'Kostot janë normale', anomaliDetektuar: 'Anomali e Kostos',
    limitAktual: 'Limiti aktual', duke2: 'Duke kontrolluar...',
    grafikTipi: 'Zgjedh Grafik'
  },
  en: {
    overview: 'Overview', kostot: 'Costs', backups: 'Backups', raport: 'AI Report',
    kostoTotale: 'TOTAL MONTHLY COST', parashikim: 'Forecast',
    backupet: 'Backups', anomali: 'Status', po: 'Anomaly', jo: 'Normal',
    grafiku: 'Cloud Service Costs', analize: 'AI Analysis',
    kliko: 'Click for AI recommendations', analizo: 'Analyze with AI',
    duke: 'Analyzing...', backupFundit: 'Recent Backups',
    shihGjithe: 'See all', nukKaDhena: 'No data yet — add configuration',
    nukKaBackup: 'No backups yet', konfiguro: 'Configure Cloud Services',
    tipi: 'EC2 Server Type', oret: 'Usage Hours', hapesira: 'S3 Storage (GB)',
    llogarit: 'Calculate & Save', historia: 'Configuration History',
    file: 'File Name', madhesia: 'Size', veprime: 'Actions',
    ngarko: 'Upload Backup', fshi: 'Delete', raportMujor: 'Monthly AI Report',
    gjenero: 'Generate Report', shkarko: 'Download PDF',
    limit: 'Set Monthly Cost Limit', limitPlaceholder: 'Limit ($)',
    vendos: 'Set Limit', dil: 'Logout', ec2: 'EC2 Type', ore: 'Hours',
    s3: 'GB S3', kosto: 'Cost/Month', muaji: 'Month', nukKaKonf: 'No configuration yet',
    kostotNormale: 'Costs are normal', anomaliDetektuar: 'Cost Anomaly',
    limitAktual: 'Current limit', duke2: 'Checking...',
    grafikTipi: 'Chart Type'
  }
};
 
// ========== MAIN COMPONENT ==========
export default function Dashboard() {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [startups,       setStartups]       = useState([]);
  const [backups,        setBackups]        = useState([]);
  const [chatLog,        setChatLog]        = useState([]);
  const [chatInput,      setChatInput]      = useState('');
  const [analiza,        setAnaliza]        = useState('');
  const [anomali,        setAnomali]        = useState(null);
  const [raporti,        setRaporti]        = useState('');
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingRaport,  setLoadingRaport]  = useState(false);
  const [chatOpen,       setChatOpen]       = useState(false);
  const [editItem,       setEditItem]       = useState(null);
  const [grafikTipi,     setGrafikTipi]     = useState('area');
  const [gjuha,          setGjuha]          = useState('sq');
  const [limitVal,       setLimitVal]       = useState(parseFloat(localStorage.getItem('limit')) || 0);
  const [limitInput,     setLimitInput]     = useState('');
  const [toast,          setToast]          = useState(null);
  const [totalKosto,     setTotalKosto]     = useState(0);
  const [limitInfo,      setLimitInfo]      = useState({});
  const [form, setForm] = useState({ ec2Type: 't2.micro', ec2Ore: 720, s3GB: 10 });
 
  const emriStartup = localStorage.getItem('emri') || 'Startup';
  const roli        = localStorage.getItem('roli') || 'punonjes';
  const t           = T[gjuha];
 
  const shfaqToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);
 
 const checkAnomaly = useCallback(async (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    setAnomali({ anomali: false, msg: 'Nuk ka konfigurime ende.' });
    return;
  }

  const totalKostoAkt = data.reduce((s, x) => s + x.kostoMujore, 0);
  const limitAkt = parseFloat(localStorage.getItem('limit')) || 0;

  // Kontrollo limitin fillimisht
  if (limitAkt > 0 && totalKostoAkt >= limitAkt * 0.8) {
    setAnomali({
      anomali: true,
      ndryshimi: limitAkt > 0 ? `${((totalKostoAkt/limitAkt)*100).toFixed(0)}% e limitit` : '',
      msg: totalKostoAkt >= limitAkt
        ? `Kostoja totale $${totalKostoAkt.toFixed(2)} ka kaluar limitin $${limitAkt}!`
        : `Kostoja totale $${totalKostoAkt.toFixed(2)} po i afrohet limitit $${limitAkt}.`
    });
    return;
  }

  if (data.length === 1) {
    const kosto = data[0].kostoMujore;
    if (kosto > 50) {
      setAnomali({
        anomali: true,
        ndryshimi: 'Kosto e lartë',
        msg: `Kostoja mujore $${kosto} është relativisht e lartë.`
      });
    } else {
      setAnomali({ anomali: false, msg: `Kostoja mujore $${kosto} është brenda kufijve normalë.` });
    }
    return;
  }

  const kostot = data.map(s => s.kostoMujore);
  const kostoAktuale = kostot[kostot.length - 1];
  const kostoMesatare = (kostot.slice(0, -1).reduce((a, b) => a + b, 0) / (kostot.length - 1)).toFixed(2);
  try {
    const res = await anomalyAI({ kostoAktuale, kostoMesatare });
    setAnomali(res.data);
  } catch { console.log('Gabim anomali'); }
}, []);
 
  // ── loadDashboard: backend kthen { startups, totalKosto, limitInfo } ────────
  const loadDashboard = useCallback(async () => {
    try {
      const res = await getDashboard();
      const data = res.data;
 
      // Mbështet të dy formatet: array direkt ose objekt me startups
      if (Array.isArray(data)) {
        setStartups(data);
        const tot = data.reduce((s, x) => s + x.kostoMujore, 0);
        setTotalKosto(parseFloat(tot.toFixed(2)));
        checkAnomaly(data);
      } else {
        const list = Array.isArray(data.startups) ? data.startups : [];
        setStartups(list);
        setTotalKosto(data.totalKosto || 0);
        setLimitInfo(data.limitInfo || {});
        if (data.limitInfo?.limit > 0) {
          setLimitVal(data.limitInfo.limit);
          localStorage.setItem('limit', data.limitInfo.limit);
        }
        checkAnomaly(list);
      }
    } catch (err) { console.log(err); }
  }, [checkAnomaly]);
 
  const loadBackups = useCallback(async () => {
    if (roli !== 'admin') return;
    try {
      const res = await listBackups();
      setBackups(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.log(err); }
  }, [roli]);
 
  useEffect(() => {
    loadDashboard();
    loadBackups();
  }, [loadDashboard, loadBackups]);
 
  const handleCreateStartup = async (e) => {
    e.preventDefault();
    try {
      await createStartup(form);
      await loadDashboard();
      setForm({ ec2Type: 't2.micro', ec2Ore: 720, s3GB: 10 });
      shfaqToast('Konfigurimi u ruajt!', 'success');
    } catch { shfaqToast('Gabim gjatë ruajtjes!', 'error'); }
  };
 
  const handleEditSave = async (id, data) => {
    try {
      await editStartup(id, data);
      await loadDashboard();
      shfaqToast('Konfigurimi u editua!', 'success');
    } catch { shfaqToast('Gabim editimi!', 'error'); }
  };
 
  const handleDeleteStartup = async (id) => {
    if (!window.confirm('Fshi këtë konfigurim?')) return;
    try {
      await deleteStartup(id);
      await loadDashboard();
      shfaqToast('Konfigurimi u fshi!', 'success');
    } catch { shfaqToast('Gabim fshirje!', 'error'); }
  };
 
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    const formData = new FormData();
    formData.append('file', file);
    shfaqToast('Duke ngarkuar...', 'info');
    try {
      await uploadBackup(formData);
      await loadBackups();
      shfaqToast('Backup u ngarkua!', 'success');
    } catch (err) {
      shfaqToast(err.response?.data?.msg || 'Gabim upload!', 'error');
    }
  };
 
  const handleDeleteBackup = async (key) => {
    if (!window.confirm('Fshi backup-in?')) return;
    try {
      await deleteBackup({ key });
      await loadBackups();
      shfaqToast('Backup u fshi!', 'success');
    } catch { shfaqToast('Gabim fshirje!', 'error'); }
  };
 
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const pyetja = chatInput;
    setChatLog(prev => [...prev, { rol: 'user', tekst: pyetja }]);
    setChatInput('');
    try {
      const res = await askChat({ pyetja });
      setChatLog(prev => [...prev, { rol: 'bot', tekst: res.data.pergjigja }]);
    } catch {
      setChatLog(prev => [...prev, { rol: 'bot', tekst: 'Gabim — provo perseri.' }]);
    }
  };
 
  const handleAnalyze = async () => {
    setLoadingAnalyze(true);
    try {
      const res = await analyzeAI();
      setAnaliza(res.data.analiza);
      shfaqToast('Analiza u krye!', 'success');
    } catch { shfaqToast('Gabim analize!', 'error'); }
    setLoadingAnalyze(false);
  };
 
  const handleReport = async () => {
    setLoadingRaport(true);
    try {
      const res = await generateReport({ startups, backups, totalKosto });
      setRaporti(res.data.raporti);
      shfaqToast('Raporti u gjenerua!', 'success');
    } catch { shfaqToast('Gabim raport!', 'error'); }
    setLoadingRaport(false);
  };
 
  // ── Vendos Limitin ───────────────────────────────────────────────────────────
  const handleVendosLimit = async () => {
    const val = parseFloat(limitInput);
    if (isNaN(val) || val < 0) {
      return shfaqToast('Shkruaj një vlerë të vlefshme (p.sh. 20)', 'error');
    }
    try {
      await setLimit({ limitKosto: val });
      setLimitVal(val);
      localStorage.setItem('limit', val);
      setLimitInput('');
      await loadDashboard();
      shfaqToast('Limiti u vendos: $' + val, 'success');
    } catch (err) {
      shfaqToast(err.response?.data?.msg || 'Gabim vendosje limiti!', 'error');
    }
  };
 
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(67, 97, 238);
    doc.text('CloudCost - Raport Mujor', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('Data: ' + new Date().toLocaleDateString('sq-AL'), 14, 32);
    doc.text('Kosto Totale: $' + totalKosto, 14, 40);
    doc.setDrawColor(67, 97, 238);
    doc.line(14, 44, 196, 44);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(raporti, 180);
    doc.text(lines, 14, 54);
    doc.save('raport-' + new Date().toLocaleDateString('sq-AL') + '.pdf');
    shfaqToast('PDF u shkarkua!', 'success');
  };
 
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
 
  const parashikimi = (parseFloat(totalKosto) * 1.08).toFixed(2);
  const limitPct    = limitVal > 0 ? Math.min((parseFloat(totalKosto) / limitVal) * 100, 100).toFixed(0) : 0;
  const limitNgjyra = limitPct >= 100 ? '#ef4444' : limitPct >= 80 ? '#f59e0b' : '#22c55e';
  const chartData   = startups.map((s, i) => ({ muaji: t.muaji + ' ' + (i + 1), kosto: s.kostoMujore }));
  const tabs        = roli === 'admin'
    ? ['overview', 'kostot', 'backups', 'raport']
    : ['overview', 'kostot', 'raport'];
  const tabLabels   = { overview: t.overview, kostot: t.kostot, backups: t.backups, raport: t.raport };
 
  const Grafiku = ({ height = 220 }) => {
    const common = [
      <CartesianGrid key="g" strokeDasharray="3 3" stroke="#f0f0f0" />,
      <XAxis key="x" dataKey="muaji" tick={{ fontSize: 11 }} />,
      <YAxis key="y" tickFormatter={v => '$' + v} tick={{ fontSize: 11 }} />,
      <Tooltip key="t" formatter={v => ['$' + v, 'Kosto']} />
    ];
    if (grafikTipi === 'bar') return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>{common}<Bar dataKey="kosto" fill="#4361ee" radius={[4,4,0,0]} /></BarChart>
      </ResponsiveContainer>
    );
    if (grafikTipi === 'line') return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>{common}<Line type="monotone" dataKey="kosto" stroke="#4361ee" strokeWidth={2} dot={{ fill: '#4361ee' }} /></LineChart>
      </ResponsiveContainer>
    );
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          {common}
          <Area type="monotone" dataKey="kosto" stroke="#4361ee" strokeWidth={2} fill="url(#cg)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
 
  return (
    <div style={s.page}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {editItem && <ModalEdit startup={editItem} onSave={handleEditSave} onClose={() => setEditItem(null)} />}
 
      {/* NAVBAR */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <div style={s.logo}><img src="/Logo1.png" alt="CloudCost" style={{ width: '28px', height: '28px', objectFit: 'contain' }} /></div>
          <span style={s.logoText}>CloudCost</span>
          <div style={s.tabs}>
            {tabs.map(tab => (
              <button key={tab} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }} onClick={() => setActiveTab(tab)}>
                {tabLabels[tab]}
                {activeTab === tab && <div style={s.tabLine} />}
              </button>
            ))}
          </div>
        </div>
        <div style={s.navRight}>
          <button style={s.gjuhaBtn} onClick={() => setGjuha(gjuha === 'sq' ? 'en' : 'sq')}>
            🌍 {gjuha === 'sq' ? 'EN' : 'SQ'}
          </button>
          <span style={{ ...s.roliBadge, background: roli === 'admin' ? '#fef3c7' : '#f0f4ff', color: roli === 'admin' ? '#92400e' : '#4361ee' }}>
            {roli === 'admin' ? '👑 Admin' : '👤 Punonjës'}
          </span>
          <div style={s.avatar}>{emriStartup.charAt(0).toUpperCase()}</div>
          <span style={s.navName}>{emriStartup}</span>
          <button style={s.gjuhaBtn} onClick={() => window.location.href = '/profile'}>👤 Profili</button>
          <button style={s.logoutBtn} onClick={logout}>{t.dil}</button>
        </div>
      </nav>
 
      <div style={s.content}>
 
        {/* LIMIT WARNING */}
        {limitVal > 0 && parseFloat(totalKosto) >= limitVal * 0.8 && (
          <div style={{ border: `1px solid ${limitNgjyra}`, background: limitPct >= 100 ? '#fef2f2' : '#fffbeb', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: limitNgjyra, fontWeight: '700' }}>
              {limitPct >= 100 ? '🚨 E keni kaluar limitin!' : '⚠️ Jeni duke u afruar limitit!'}
            </span>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>
              ${totalKosto} / ${limitVal} ({limitPct}%)
            </span>
          </div>
        )}
 
        {/* ===== OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <div>
            {/* HERO */}
            <div style={s.heroCard}>
              <p style={s.heroLabel}>{t.kostoTotale}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <h1 style={s.heroNum}>${totalKosto}</h1>
              </div>
 
              {/* LIMIT PROGRESS */}
              {limitVal > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>{t.limitAktual}: ${limitVal}</span>
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>{limitPct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: limitPct + '%', background: limitPct >= 100 ? '#ef4444' : limitPct >= 80 ? '#f59e0b' : '#22c55e', height: '100%', borderRadius: '8px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              )}
 
              <div style={s.heroStats}>
                <div>
                  <p style={s.heroStatLabel}>{t.parashikim}</p>
                  <p style={s.heroStatVal}>${parashikimi}</p>
                </div>
                <div style={s.divider} />
                <div>
                  <p style={s.heroStatLabel}>{t.backupet}</p>
                  <p style={s.heroStatVal}>{roli === 'admin' ? backups.length + ' file' : 'N/A'}</p>
                </div>
                <div style={s.divider} />
                <div>
                  <p style={s.heroStatLabel}>{t.anomali}</p>
                  <p style={{ ...s.heroStatVal, color: anomali === null ? '#e5e7eb' : anomali.anomali ? '#fca5a5' : '#86efac' }}>
                    {anomali === null ? t.duke2 : anomali.anomali ? '⚠️ ' + t.po : '✅ ' + t.jo}
                  </p>
                </div>
              </div>
            </div>
 
            {/* ANOMALI KARTA */}
            {anomali && (
              <div style={{
                background: anomali.anomali ? '#fffbeb' : '#f0fdf4',
                border: `1px solid ${anomali.anomali ? '#fcd34d' : '#86efac'}`,
                borderRadius: '12px', padding: '20px', marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{anomali.anomali ? '⚠️' : '✅'}</span>
                  <strong style={{ color: anomali.anomali ? '#92400e' : '#166534', fontSize: '15px' }}>
                    {anomali.anomali
                      ? t.anomaliDetektuar + (anomali.ndryshimi ? ' — ' + anomali.ndryshimi : '')
                      : t.kostotNormale}
                  </strong>
                </div>
                <p style={{ color: anomali.anomali ? '#78350f' : '#166534', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  {anomali.msg}
                </p>
              </div>
            )}
 
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* GRAFIKU */}
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={s.cardTitle}>📈 {t.grafiku}</h3>
                  <select style={s.selectSmall} value={grafikTipi} onChange={e => setGrafikTipi(e.target.value)}>
                    <option value="area">📈 Area</option>
                    <option value="line">📉 Line</option>
                    <option value="bar">📊 Bar</option>
                  </select>
                </div>
                {chartData.length === 0 ? <p style={s.empty}>{t.nukKaDhena}</p> : <Grafiku height={220} />}
              </div>
 
              {/* ANALIZE AI */}
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={s.cardTitle}>🤖 {t.analize}</h3>
                  <span style={{ background: '#f3e8ff', color: '#7b2d8b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>✨ AI</span>
                </div>
                <button style={{ width: '100%', padding: '10px', background: '#7b2d8b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginBottom: '12px' }} onClick={handleAnalyze} disabled={loadingAnalyze}>
                  {loadingAnalyze ? '⏳ ' + t.duke : '🔍 ' + t.analizo}
                </button>
                {analiza
                  ? <div style={{ background: '#f3e8ff', borderRadius: '8px', padding: '12px', border: '1px solid #e9d5ff' }}><p style={{ fontSize: '13px', lineHeight: '1.7', color: '#4c1d95', margin: 0 }}>{analiza}</p></div>
                  : <p style={s.empty}>{t.kliko}</p>
                }
              </div>
            </div>
 
            {/* LIMIT */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>💰 {t.limit}</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  style={{ ...inp, maxWidth: '200px' }}
                  type="number"
                  placeholder={t.limitPlaceholder}
                  value={limitInput}
                  onChange={e => setLimitInput(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <button style={s.btn} onClick={handleVendosLimit}>{t.vendos}</button>
                {limitVal > 0 && (
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    {t.limitAktual}: <strong style={{ color: limitNgjyra }}>${limitVal}</strong>
                  </span>
                )}
              </div>
            </div>
 
            {/* BACKUP MINI — vetem admin */}
            {roli === 'admin' && (
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={s.cardTitle}>🗄️ {t.backupFundit}</h3>
                  <button style={s.btnSmall} onClick={() => setActiveTab('backups')}>{t.shihGjithe} →</button>
                </div>
                {backups.length === 0 ? <p style={s.empty}>{t.nukKaBackup}</p> : (
                  <table style={s.table}>
                    <thead><tr style={s.thead}><th style={s.th}>{t.file}</th><th style={s.th}>{t.madhesia}</th><th style={s.th}>{t.veprime}</th></tr></thead>
                    <tbody>
                      {backups.slice(0, 3).map((b, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                          <td style={s.td}>📄 {b.Key.split('/').pop()}</td>
                          <td style={s.td}>{(b.Size / 1024).toFixed(1)} KB</td>
                          <td style={s.td}><button style={s.deleteBtn} onClick={() => handleDeleteBackup(b.Key)}>{t.fshi}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
 
        {/* ===== KOSTOT ===== */}
        {activeTab === 'kostot' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={s.card}>
                <h3 style={s.cardTitle}>⚙️ {t.konfiguro}</h3>
                <form onSubmit={handleCreateStartup}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>{t.tipi}</label>
                    <select style={inp} value={form.ec2Type} onChange={e => setForm({ ...form, ec2Type: e.target.value })}>
                      <option value="t2.micro">t2.micro — $0.0116/orë (1-100 përdorues)</option>
                      <option value="t2.small">t2.small — $0.0230/orë (100-500 përdorues)</option>
                      <option value="t2.medium">t2.medium — $0.0464/orë (500+ përdorues)</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>{t.oret}</label>
                    <input style={inp} type="number" placeholder="720 = gjithë muajin" value={form.ec2Ore} onChange={e => setForm({ ...form, ec2Ore: e.target.value })} required />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>{t.hapesira}</label>
                    <input style={inp} type="number" placeholder="p.sh. 10, 20, 50 GB" value={form.s3GB} onChange={e => setForm({ ...form, s3GB: e.target.value })} required />
                  </div>
                  <button style={{ ...s.btn, width: '100%' }} type="submit">💾 {t.llogarit}</button>
                </form>
              </div>
 
              <div style={s.card}>
                <h3 style={s.cardTitle}>📊 {t.historia}</h3>
                {startups.length === 0 ? <p style={s.empty}>{t.nukKaKonf}</p> : (
                  <table style={s.table}>
                    <thead>
                      <tr style={s.thead}>
                        <th style={s.th}>{t.ec2}</th>
                        <th style={s.th}>{t.ore}</th>
                        <th style={s.th}>{t.s3}</th>
                        <th style={s.th}>{t.kosto}</th>
                        <th style={s.th}>{t.veprime}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {startups.map((st, i) => (
                        <tr key={st._id || i} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                          <td style={s.td}>{st.ec2Type}</td>
                          <td style={s.td}>{st.ec2Ore}h</td>
                          <td style={s.td}>{st.s3GB} GB</td>
                          <td style={{ ...s.td, color: '#4361ee', fontWeight: 'bold' }}>${st.kostoMujore}</td>
                          <td style={s.td}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button style={s.editBtn} onClick={() => setEditItem(st)}>✏️</button>
                              <button style={s.deleteBtn} onClick={() => handleDeleteStartup(st._id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div style={{ marginTop: '16px', padding: '16px', background: '#f0f7ff', borderRadius: '8px' }}>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Kosto Totale</p>
                  <p style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#4361ee' }}>${totalKosto}</p>
                </div>
              </div>
            </div>
 
            {chartData.length > 0 && (
              <div style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={s.cardTitle}>📈 {t.grafiku}</h3>
                  <select style={s.selectSmall} value={grafikTipi} onChange={e => setGrafikTipi(e.target.value)}>
                    <option value="area">📈 Area</option>
                    <option value="line">📉 Line</option>
                    <option value="bar">📊 Bar</option>
                  </select>
                </div>
                <Grafiku height={300} />
              </div>
            )}
          </div>
        )}
 
        {/* ===== BACKUPS — vetem admin ===== */}
        {activeTab === 'backups' && roli === 'admin' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={s.cardTitle}>🗄️ {t.backupet}</h3>
              <label style={{ display: 'inline-block', padding: '8px 16px', background: '#4361ee', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                📁 {t.ngarko}
                <input type="file" style={{ display: 'none' }} onChange={handleUpload} />
              </label>
            </div>
            {backups.length === 0 ? <p style={s.empty}>{t.nukKaBackup}</p> : (
              <table style={s.table}>
                <thead><tr style={s.thead}><th style={s.th}>{t.file}</th><th style={s.th}>{t.madhesia}</th><th style={s.th}>{t.veprime}</th></tr></thead>
                <tbody>
                  {backups.map((b, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                      <td style={s.td}>📄 {b.Key.split('/').pop()}</td>
                      <td style={s.td}>{(b.Size / 1024).toFixed(1)} KB</td>
                      <td style={s.td}><button style={s.deleteBtn} onClick={() => handleDeleteBackup(b.Key)}>🗑️ {t.fshi}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
 
        {/* ===== RAPORT AI ===== */}
        {activeTab === 'raport' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={s.cardTitle}>📄 {t.raportMujor}</h3>
              {raporti && <button style={{ ...s.btn, background: '#06d6a0' }} onClick={downloadPDF}>⬇️ {t.shkarko}</button>}
            </div>
            <button style={s.btn} onClick={handleReport} disabled={loadingRaport}>
              {loadingRaport ? '⏳ Duke gjeneruar...' : '📝 ' + t.gjenero}
            </button>
            {raporti
              ? <div style={{ marginTop: '20px', padding: '20px', background: '#f0f7ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <strong style={{ color: '#1e3a5f' }}>📋 Raporti:</strong>
                  <p style={{ marginTop: '12px', lineHeight: '1.8', whiteSpace: 'pre-line', color: '#1e3a5f', fontSize: '14px' }}>{raporti}</p>
                </div>
              : <p style={s.empty}>Kliko "Gjenero Raportin" per analizen e plote</p>
            }
          </div>
        )}
      </div>
 
      {/* CHATBOX */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        {chatOpen && (
          <div style={{ width: '320px', height: '400px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: '#4361ee', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
              <span>💬 ChatBox AI </span>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }} onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatLog.length === 0 && <p style={{ color: '#999', textAlign: 'center', fontSize: '13px' }}>Pyete dicka...</p>}
              {chatLog.map((msg, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '12px', maxWidth: '80%', fontSize: '13px', alignSelf: msg.rol === 'user' ? 'flex-end' : 'flex-start', background: msg.rol === 'user' ? '#4361ee' : '#f0f0f0', color: msg.rol === 'user' ? 'white' : '#333' }}>
                  {msg.tekst}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '8px' }}>
              <input style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} placeholder="Shkruaj pyetjen..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChat()} />
              <button style={{ padding: '8px 12px', background: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={handleChat}>➤</button>
            </div>
          </div>
        )}
        <button style={{ padding: '12px 20px', background: '#4361ee', color: 'white', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(67,97,238,0.4)' }} onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? '✕' : '💬 ChatBox AI'}
        </button>
      </div>
    </div>
  );
}
 
const s = {
  page:       { background: '#f8f9fc', minHeight: '100vh', fontFamily: 'sans-serif' },
  navbar:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', background: 'white', borderBottom: '1px solid #e5e7eb', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  navLeft:    { display: 'flex', alignItems: 'center', gap: '24px' },
  logo:       { width: '32px', height: '32px', background: '#4361ee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  logoText:   { fontWeight: '700', fontSize: '16px', color: '#1a1a2e' },
  tabs:       { display: 'flex', gap: '4px' },
  tab:        { position: 'relative', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#6b7280', fontWeight: '500' },
  tabActive:  { color: '#4361ee' },
  tabLine:    { position: 'absolute', bottom: '-10px', left: 0, right: 0, height: '2px', background: '#4361ee', borderRadius: '2px' },
  navRight:   { display: 'flex', alignItems: 'center', gap: '10px' },
  gjuhaBtn:   { padding: '5px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  roliBadge:  { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  avatar:     { width: '32px', height: '32px', background: '#4361ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' },
  navName:    { fontSize: '14px', color: '#374151', fontWeight: '500' },
  logoutBtn:  { padding: '6px 14px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  content:    { padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  heroCard:   { background: 'linear-gradient(135deg, #4361ee, #7b5ea7)', borderRadius: '16px', padding: '32px', marginBottom: '24px', color: 'white' },
  heroLabel:  { fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', opacity: 0.8, margin: '0 0 8px' },
  heroNum:    { fontSize: '48px', fontWeight: '800', margin: 0, color: 'white' },
  heroStats:  { display: 'flex', gap: '32px', alignItems: 'center' },
  heroStatLabel: { margin: '0 0 4px', fontSize: '12px', opacity: 0.8 },
  heroStatVal:   { margin: 0, fontSize: '20px', fontWeight: '700', color: 'white' },
  divider:    { width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' },
  card:       { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  cardTitle:  { margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  selectSmall:{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '13px', cursor: 'pointer' },
  btn:        { padding: '10px 20px', background: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  btnSmall:   { padding: '6px 12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  table:      { width: '100%', borderCollapse: 'collapse' },
  thead:      { background: '#f8f9fc' },
  th:         { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' },
  td:         { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151' },
  editBtn:    { padding: '4px 8px', background: '#f0f4ff', color: '#4361ee', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' },
  deleteBtn:  { padding: '4px 10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' },
  empty:      { color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px 0' }
};
 