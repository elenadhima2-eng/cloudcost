import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '💰',
      title: 'Monitorim Kostosh',
      desc: 'Shiko në kohë reale sa po shpenzon çdo muaj në AWS. Llogaritje automatike bazuar në çmimet reale.'
    },
    {
      icon: '🤖',
      title: 'Analizë me AI',
      desc: 'Gemini AI analizon konfigurimet tuaja dhe jep rekomandime konkrete për të kursyer para.'
    },
    {
      icon: '🗄️',
      title: 'Backup i Sigurt',
      desc: 'Ngarko dhe menaxho backup-et e të dhënave tuaja direkt nga dashboard. I aksesueshem vetëm nga Admin.'
    },
    {
      icon: '⚠️',
      title: 'Alarm Kostosh',
      desc: 'Vendos limit mujor dhe merr njoftim kur jeni duke u afruar ose e keni kaluar buxhetin.'
    },
    {
      icon: '📊',
      title: 'Grafiqe Interaktive',
      desc: 'Vizualizimt me Area, Line dhe Bar charts. Shiko historikun e kostove dhe trendet.'
    },
    {
      icon: '🌍',
      title: 'Dygjuhësh',
      desc: 'Platforma disponohet plotësisht në Shqip dhe Anglisht. Toggle i shpejtë midis gjuhëve.'
    }
  ];

  const stats = [
    { num: '$0', label: 'Kosto fillestare' },
    { num: '3', label: 'Lloje grafiqesh' },
    { num: 'AI', label: 'Gemini powered' },
    { num: '24/7', label: 'Monitorim' }
  ];

  return (
    <div style={s.page}>

      {/* BACKGROUND BLOBS */}
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      {/* NAVBAR */}
      <nav style={{
        ...s.navbar,
        background: scrollY > 50 ? 'rgba(10,10,20,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(139,92,246,0.2)' : 'none'
      }}>
        <div style={s.navLogo}>
          <img src="/LOGOJAA.png" alt="CloudCost" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={s.navBrand}>CloudCost</span>
        </div>
        <div style={s.navLinks}>
          <span style={s.navLink} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Funksionet</span>
          <span style={s.navLink} onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })}>Statistikat</span>
          <button style={s.navLoginBtn} onClick={() => navigate('/login')}>Hyr</button>
          <button style={s.navSignupBtn} onClick={() => navigate('/register')}>Regjistrohu</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot} />
            Monitor, Optimize, Save
          </div>
          <h1 style={s.heroTitle}>
            Cloud costs,
            <br />
            <span style={s.heroTitleGrad}>under control.</span>
          </h1>
          <p style={s.heroDesc}>
            CloudCost është platforma inteligjente për startup-et që dëshirojnë të
            kontrollojnë shpenzimet cloud, të menaxhojnë backup-et dhe të marrin
            rekomandime nga AI — gjithçka në një vend.
          </p>
          <div style={s.heroBtns}>
            <button style={s.heroBtnPrimary} onClick={() => navigate('/register')}>
              Fillo Falas →
            </button>
            <button style={s.heroBtnSecondary} onClick={() => navigate('/login')}>
              Hyr në Llogari
            </button>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div style={s.heroVisual}>
          <div style={s.heroCard}>
            <div style={s.heroCardHeader}>
              <div style={s.heroCardDot} />
              <div style={{ ...s.heroCardDot, background: '#f59e0b' }} />
              <div style={{ ...s.heroCardDot, background: '#22c55e' }} />
              <span style={s.heroCardTitle}>CloudCost Dashboard</span>
            </div>
            <div style={s.heroCardBody}>
              <div style={s.heroStat}>
                <span style={s.heroStatLabel}>Kosto Mujore</span>
                <span style={s.heroStatVal}>$8.70</span>
              </div>
              <div style={s.heroStatBar}>
                <div style={s.heroStatBarFill} />
              </div>
              <div style={s.heroStatRow}>
                <div style={s.heroStatItem}>
                  <span style={s.heroStatItemLabel}>EC2</span>
                  <span style={s.heroStatItemVal}>$8.35</span>
                </div>
                <div style={s.heroStatItem}>
                  <span style={s.heroStatItemLabel}>S3</span>
                  <span style={s.heroStatItemVal}>$0.35</span>
                </div>
                <div style={s.heroStatItem}>
                  <span style={s.heroStatItemLabel}>Limit</span>
                  <span style={{ ...s.heroStatItemVal, color: '#22c55e' }}>$20</span>
                </div>
              </div>
              <div style={s.heroAiBadge}>
                🤖 AI: Shko në t2.micro Reserved → kurse 30%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" style={s.statsSection}>
        {stats.map((st, i) => (
          <div key={i} style={s.statItem}>
            <span style={s.statNum}>{st.num}</span>
            <span style={s.statLabel}>{st.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" style={s.featuresSection}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>Funksionet</span>
          <h2 style={s.sectionTitle}>Gjithçka që ju duhet</h2>
          <p style={s.sectionDesc}>
            Nga monitorimi i kostove deri te backup-et e sigurta — CloudCost mbulon të gjitha nevojat tuaja cloud.
          </p>
        </div>
        <div style={s.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={s.featureCard}>
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={s.howSection}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTag}>Si Funksionon</span>
          <h2 style={s.sectionTitle}>3 hapa, gjithçka gati</h2>
        </div>
        <div style={s.stepsGrid}>
          {[
            { num: '01', title: 'Regjistrohu', desc: 'Krijo llogari falas dhe zgjidh rolin tënd — Admin ose Punonjës.' },
            { num: '02', title: 'Konfiguro', desc: 'Fut parametrat e AWS-it tënd dhe platforma llogarit kostot automatikisht.' },
            { num: '03', title: 'Optimizo', desc: 'Merr rekomandime nga AI dhe reduktoni shpenzimet cloud çdo muaj.' }
          ].map((step, i) => (
            <div key={i} style={s.stepCard}>
              <span style={s.stepNum}>{step.num}</span>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaCard}>
          <div style={s.ctaBlob} />
          <img src="/LOGOJAA.png" alt="CloudCost" style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '24px', position: 'relative' }} />
          <h2 style={s.ctaTitle}>Gati të filloni?</h2>
          <p style={s.ctaDesc}>
            Bashkohuni me startup-et që po kursejnë me CloudCost sot.
          </p>
          <button style={s.ctaBtn} onClick={() => navigate('/register')}>
            Fillo Falas — Tani →
          </button>
          <p style={s.ctaNote}>Nuk kërkohet kartë krediti</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>
          <img src="/LOGOJAA.png" alt="CloudCost" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={s.footerBrand}>CloudCost</span>
        </div>
        <p style={s.footerText}>Monitor, Optimize, Save — © 2026 CloudCost</p>
        <div style={s.footerLinks}>
          <span style={s.footerLink} onClick={() => navigate('/login')}>Login</span>
          <span style={s.footerLink} onClick={() => navigate('/register')}>Register</span>
        </div>
      </footer>

    </div>
  );
}

const PURPLE = '#8b5cf6';
const PURPLE_DARK = '#7c3aed';
const BG = '#080810';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(139,92,246,0.2)';

const s = {
  page: {
    background: BG,
    minHeight: '100vh',
    color: 'white',
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    overflow: 'hidden',
    position: 'relative'
  },
  blob1: {
    position: 'fixed', top: '-200px', left: '-200px',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0
  },
  blob2: {
    position: 'fixed', top: '40%', right: '-150px',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0
  },
  blob3: {
    position: 'fixed', bottom: '-100px', left: '30%',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0
  },

  // NAVBAR
  navbar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 48px', transition: 'all 0.3s ease'
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBrand: { fontFamily: "'Sora', sans-serif", fontWeight: '800', fontSize: '20px', color: 'white', letterSpacing: '-0.5px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '32px' },
  navLink: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'color 0.2s', fontWeight: '500' },
  navLoginBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  navSignupBtn: { background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`, border: 'none', color: 'white', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' },

  // HERO
  hero: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    padding: '120px 48px 80px', gap: '60px', position: 'relative', zIndex: 1,
    maxWidth: '1200px', margin: '0 auto'
  },
  heroContent: { flex: 1 },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '100px', padding: '6px 16px', fontSize: '13px',
    color: '#c4b5fd', fontWeight: '600', marginBottom: '24px'
  },
  heroBadgeDot: { width: '6px', height: '6px', borderRadius: '50%', background: PURPLE, animation: 'pulse 2s infinite' },
  heroTitle: {
    fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: '900',
    lineHeight: '1.05', margin: '0 0 24px', letterSpacing: '-2px',
    fontFamily: "'Sora', sans-serif"
  },
  heroTitleGrad: {
    background: `linear-gradient(135deg, ${PURPLE} 0%, #c4b5fd 50%, #a78bfa 100%)`,
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  heroDesc: {
    fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7',
    maxWidth: '480px', margin: '0 0 40px'
  },
  heroBtns: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  heroBtnPrimary: {
    background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
    border: 'none', color: 'white', padding: '14px 32px',
    borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700',
    boxShadow: '0 8px 32px rgba(139,92,246,0.4)', transition: 'transform 0.2s'
  },
  heroBtnSecondary: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
    color: 'white', padding: '14px 32px', borderRadius: '12px',
    cursor: 'pointer', fontSize: '16px', fontWeight: '600'
  },

  // HERO VISUAL
  heroVisual: { flex: 1, display: 'flex', justifyContent: 'center' },
  heroCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.25)',
    borderRadius: '20px', padding: '0', overflow: 'hidden', width: '100%',
    maxWidth: '380px', backdropFilter: 'blur(20px)',
    boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)'
  },
  heroCardHeader: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '14px 20px', background: 'rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  heroCardDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' },
  heroCardTitle: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px', fontWeight: '500' },
  heroCardBody: { padding: '24px' },
  heroStat: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' },
  heroStatLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  heroStatVal: { fontSize: '32px', fontWeight: '800', color: 'white', fontFamily: "'Sora', sans-serif" },
  heroStatBar: { height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', marginBottom: '20px', overflow: 'hidden' },
  heroStatBarFill: { height: '100%', width: '44%', background: `linear-gradient(90deg, ${PURPLE}, #c4b5fd)`, borderRadius: '100px' },
  heroStatRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' },
  heroStatItem: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', textAlign: 'center' },
  heroStatItemLabel: { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' },
  heroStatItemVal: { fontSize: '16px', fontWeight: '700', color: 'white' },
  heroAiBadge: {
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '10px', padding: '10px 14px', fontSize: '12px',
    color: '#c4b5fd', fontWeight: '500', lineHeight: '1.5'
  },

  // STATS
  statsSection: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px', background: BORDER,
    borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
    position: 'relative', zIndex: 1
  },
  statItem: {
    background: BG, padding: '40px 24px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', gap: '8px'
  },
  statNum: { fontSize: '40px', fontWeight: '900', color: PURPLE, fontFamily: "'Sora', sans-serif", letterSpacing: '-1px' },
  statLabel: { fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' },

  // FEATURES
  featuresSection: { padding: '100px 48px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 },
  sectionHeader: { textAlign: 'center', marginBottom: '60px' },
  sectionTag: {
    display: 'inline-block', background: 'rgba(139,92,246,0.15)',
    border: `1px solid ${BORDER}`, borderRadius: '100px',
    padding: '5px 16px', fontSize: '12px', color: '#c4b5fd',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px'
  },
  sectionTitle: { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', margin: '0 0 16px', letterSpacing: '-1px', fontFamily: "'Sora', sans-serif" },
  sectionDesc: { fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  featureCard: {
    background: CARD_BG, border: `1px solid ${BORDER}`,
    borderRadius: '16px', padding: '28px', transition: 'all 0.3s ease',
    cursor: 'default'
  },
  featureIcon: { fontSize: '32px', marginBottom: '16px', display: 'block' },
  featureTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 10px', color: 'white', fontFamily: "'Sora', sans-serif" },
  featureDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', margin: 0 },

  // HOW IT WORKS
  howSection: { padding: '80px 48px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '20px' },
  stepCard: {
    background: CARD_BG, border: `1px solid ${BORDER}`,
    borderRadius: '16px', padding: '32px', position: 'relative'
  },
  stepNum: {
    display: 'block', fontSize: '48px', fontWeight: '900',
    color: 'rgba(139,92,246,0.3)', fontFamily: "'Sora', sans-serif",
    letterSpacing: '-2px', marginBottom: '16px'
  },
  stepTitle: { fontSize: '20px', fontWeight: '700', margin: '0 0 12px', fontFamily: "'Sora', sans-serif" },
  stepDesc: { fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', margin: 0 },

  // CTA
  ctaSection: { padding: '80px 48px', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 },
  ctaCard: {
    background: 'rgba(139,92,246,0.08)', border: `1px solid ${BORDER}`,
    borderRadius: '24px', padding: '60px', textAlign: 'center', position: 'relative', overflow: 'hidden'
  },
  ctaBlob: {
    position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
    width: '400px', height: '400px', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
    borderRadius: '50%'
  },
  ctaTitle: { fontSize: '40px', fontWeight: '900', margin: '0 0 16px', letterSpacing: '-1px', fontFamily: "'Sora', sans-serif", position: 'relative' },
  ctaDesc: { fontSize: '18px', color: 'rgba(255,255,255,0.6)', margin: '0 0 36px', lineHeight: '1.6', position: 'relative' },
  ctaBtn: {
    background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
    border: 'none', color: 'white', padding: '16px 40px',
    borderRadius: '12px', cursor: 'pointer', fontSize: '17px', fontWeight: '700',
    boxShadow: '0 8px 32px rgba(139,92,246,0.5)', position: 'relative'
  },
  ctaNote: { fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '16px', position: 'relative' },

  // FOOTER
  footer: {
    padding: '32px 48px', borderTop: `1px solid ${BORDER}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'relative', zIndex: 1
  },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  footerBrand: { fontWeight: '800', fontSize: '16px', color: 'white', fontFamily: "'Sora', sans-serif" },
  footerText: { fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 },
  footerLinks: { display: 'flex', gap: '24px' },
  footerLink: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: '500' }
};