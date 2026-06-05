const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const User     = require('../models/User');
const authMW   = require('../middleware/auth');
 
// Helper — validim fjalëkalimi
function validoFjalekalimin(fjalekalimi) {
  if (fjalekalimi.length < 8)
    return 'Fjalëkalimi duhet të ketë të paktën 8 karaktere';
  if (!/[A-Z]/.test(fjalekalimi))
    return 'Fjalëkalimi duhet të ketë të paktën 1 shkronjë të madhe (A-Z)';
  if (!/[0-9]/.test(fjalekalimi))
    return 'Fjalëkalimi duhet të ketë të paktën 1 numër';
  return null;
}
 
// ── REGJISTRIM ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { emri, email, fjalekalimi, roli } = req.body;
 
    if (!emri || !email || !fjalekalimi)
      return res.status(400).json({ msg: 'Të gjitha fushat janë të detyrueshme' });
 
    // Validim fjalëkalimi
    const errFjal = validoFjalekalimin(fjalekalimi);
    if (errFjal) return res.status(400).json({ msg: errFjal });
 
    // Kontrollo email ekzistues
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ msg: 'Ky email është i regjistruar' });
 
    // Hash fjalëkalimi
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(fjalekalimi, salt);
 
    // Token verifikimi (opsional, nëse nuk del email — lejo login direkt)
    const verToken = crypto.randomBytes(32).toString('hex');
 
    const reguarRoli = ['admin', 'punonjes'].includes(roli) ? roli : 'punonjes';
 
    const user = new User({
      emri:            emri.trim(),
      email:           email.toLowerCase().trim(),
      fjalekalimi:     hash,
      roli:            reguarRoli,
      verifikimToken:  verToken,
      emailVerifikuar: false,
      limitKosto:      0
    });
 
    await user.save();
 
    // Provo dërgimin e emailit — nëse dështon, vazhdo
    try {
      const { dergoEmailVerifikim } = require('../utils/email');
      await dergoEmailVerifikim(user.email, user.emri, verToken);
    } catch (emailErr) {
      console.error('Email gabim (jo kritik):', emailErr.message);
    }
 
    res.json({
      msg: 'Regjistrimi u krye me sukses! Kontrollo email-in për verifikim.',
      email: user.email
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim serveri: ' + err.message });
  }
});
 
// ── VERIFIKIM EMAIL ───────────────────────────────────────────────────────────
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verifikimToken: req.params.token });
    if (!user)
      return res.status(400).send('<h2>❌ Token i pavlefshëm ose ka skaduar.</h2>');
 
    user.emailVerifikuar = true;
    user.verifikimToken  = undefined;
    await user.save();
 
    res.send(`
      <html><body style="font-family:Arial;text-align:center;padding:60px">
        <h1 style="color:#4361ee">☁️ CloudCost</h1>
        <h2 style="color:#166534">✅ Email-i u verifikua me sukses!</h2>
        <p>Tani mund të <a href="http://localhost:3000/login">hyni në platformë</a>.</p>
      </body></html>
    `);
  } catch (err) {
    res.status(500).send('<h2>Gabim serveri</h2>');
  }
});
 
// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, fjalekalimi } = req.body;
 
    if (!email || !fjalekalimi)
      return res.status(400).json({ msg: 'Email dhe fjalëkalimi janë të detyrueshme' });
 
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ msg: 'Email i gabuar' });
 
    // Nëse email nuk është verifikuar — lejo hyrjen por trego mesazh
    // (hiq komentin nëse dëshiron ta detyrosh verifikimin)
    // if (!user.emailVerifikuar)
    //   return res.status(400).json({ msg: 'Verifiko email-in para se të hysh' });
 
    const valid = await bcrypt.compare(fjalekalimi, user.fjalekalimi);
    if (!valid)
      return res.status(400).json({ msg: 'Fjalëkalim i gabuar' });
 
    const token = jwt.sign(
      { userId: user._id, roli: user.roli },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
 
    // Dërgo email njoftimi pas login — nëse dështon vazhdo
    try {
      const { dergoEmailLogin } = require('../utils/email');
      await dergoEmailLogin(user.email, user.emri);
    } catch (emailErr) {
      console.error('Login email gabim (jo kritik):', emailErr.message);
    }
 
    res.json({
      token,
      emri:      user.emri,
      roli:      user.roli,
      limitKosto: user.limitKosto || 0
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim serveri: ' + err.message });
  }
});
 
// ── MERR PROFIL ───────────────────────────────────────────────────────────────
router.get('/profil', authMW, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-fjalekalimi -verifikimToken');
    if (!user) return res.status(404).json({ msg: 'Perdoruesi nuk u gjet' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Gabim serveri' });
  }
});
 
// ── PËRDITËSO PROFIL ──────────────────────────────────────────────────────────
router.put('/profil', authMW, async (req, res) => {
  try {
    const { emri, email } = req.body;
 
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.userId } });
      if (existing) return res.status(400).json({ msg: 'Ky email përdoret nga llogari tjetër' });
    }
 
    const updates = {};
    if (emri) updates.emri = emri.trim();
    if (email) updates.email = email.toLowerCase().trim();
 
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true })
      .select('-fjalekalimi -verifikimToken');
 
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Gabim serveri' });
  }
});
 
// ── NDRYSHO FJALËKALIM ────────────────────────────────────────────────────────
router.put('/fjalekalim', authMW, async (req, res) => {
  try {
    const { fjalekalimiVjeter, fjalekalimiRi } = req.body;
 
    const user  = await User.findById(req.userId);
    const valid = await bcrypt.compare(fjalekalimiVjeter, user.fjalekalimi);
    if (!valid) return res.status(400).json({ msg: 'Fjalëkalimi aktual është i gabuar' });
 
    const errFjal = validoFjalekalimin(fjalekalimiRi);
    if (errFjal) return res.status(400).json({ msg: errFjal });
 
    const salt = await bcrypt.genSalt(12);
    user.fjalekalimi = await bcrypt.hash(fjalekalimiRi, salt);
    await user.save();
 
    res.json({ msg: 'Fjalëkalimi u ndryshua me sukses' });
  } catch (err) {
    res.status(500).json({ msg: 'Gabim serveri' });
  }
});
 
// ── FSHI PROFIL ───────────────────────────────────────────────────────────────
router.delete('/profil', authMW, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ msg: 'Profili u fshi me sukses' });
  } catch (err) {
    res.status(500).json({ msg: 'Gabim serveri' });
  }
});
 
module.exports = router;