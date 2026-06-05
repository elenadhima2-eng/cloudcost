const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Startup = require('../models/Startup');
const User    = require('../models/User');
 
// ── Çmimet reale AWS (USD/orë) ────────────────────────────────────────────────
const CMIMET = {
  't2.micro':  0.0116,
  't2.small':  0.0230,
  't2.medium': 0.0464,
  't3.micro':  0.0104,
  't3.small':  0.0208,
  't3.medium': 0.0416
};
const S3_PER_GB = 0.023;
 
// ── KRIJO / SHTO KONFIGURIM ───────────────────────────────────────────────────
router.post('/create', auth, async (req, res) => {
  try {
    const { emri, ec2Type, ec2Ore, s3GB } = req.body;
 
    // Validim
    if (!ec2Type || !ec2Ore || s3GB === undefined) {
      return res.status(400).json({ msg: 'Të gjitha fushat janë të detyrueshme' });
    }
    if (!CMIMET[ec2Type]) {
      return res.status(400).json({ msg: 'EC2 type i pavlefshëm' });
    }
 
    // Emri merret nga user-i nëse nuk jepet
    let emriStartup = emri;
    if (!emriStartup) {
      const user = await User.findById(req.userId);
      emriStartup = user ? user.emri : 'Startup';
    }
 
    // Llogaritja e kostos
    const kostoEC2    = CMIMET[ec2Type] * Number(ec2Ore);
    const kostoS3     = S3_PER_GB * Number(s3GB);
    const kostoMujore = parseFloat((kostoEC2 + kostoS3).toFixed(2));
 
    const startup = new Startup({
      userId:      req.userId,
      emri:        emriStartup,
      ec2Type,
      ec2Ore:      Number(ec2Ore),
      s3GB:        Number(s3GB),
      kostoMujore
    });
 
    await startup.save();
 
    // Kontrollo limitin dhe kthej alert
    const user  = await User.findById(req.userId);
    let limitAlert = null;
    if (user && user.limitKosto && user.limitKosto > 0) {
      // Merr totalin e ri
      const gjitheSt    = await Startup.find({ userId: req.userId });
      const totalKosto  = gjitheSt.reduce((s, x) => s + x.kostoMujore, 0);
      const perqindja   = Math.round((totalKosto / user.limitKosto) * 100);
 
      if (perqindja >= 100) {
        limitAlert = { lloji: 'kaloi', perqindja, totalKosto: totalKosto.toFixed(2), limit: user.limitKosto };
      } else if (perqindja >= 80) {
        limitAlert = { lloji: 'afer', perqindja, totalKosto: totalKosto.toFixed(2), limit: user.limitKosto };
      }
    }
 
    res.json({ startup, kostoMujore, limitAlert });
  } catch (err) {
    console.error('CREATE ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim serveri: ' + err.message });
  }
});
 
// ── DASHBOARD — merr konfigurimet ─────────────────────────────────────────────
router.get('/dashboard', auth, async (req, res) => {
  try {
    const startups = await Startup.find({ userId: req.userId }).sort({ createdAt: -1 });
    const user     = await User.findById(req.userId).select('limitKosto emri roli');
 
    const totalKosto = startups.reduce((s, x) => s + x.kostoMujore, 0);
    const limit      = user?.limitKosto || 0;
    const perqindja  = limit > 0 ? Math.min(Math.round((totalKosto / limit) * 100), 100) : 0;
 
    res.json({
      startups,
      totalKosto:  parseFloat(totalKosto.toFixed(2)),
      user:        { emri: user?.emri, roli: user?.roli, limitKosto: limit },
      limitInfo: {
        limit,
        totalKosto: parseFloat(totalKosto.toFixed(2)),
        perqindja,
        kaloi:  limit > 0 && totalKosto > limit,
        afer:   limit > 0 && totalKosto >= limit * 0.8 && totalKosto <= limit
      }
    });
  } catch (err) {
    console.error('DASHBOARD ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim serveri: ' + err.message });
  }
});
 
// ── EDITO KONFIGURIM ──────────────────────────────────────────────────────────
router.put('/edit/:id', auth, async (req, res) => {
  try {
    const { ec2Type, ec2Ore, s3GB } = req.body;
 
    if (!CMIMET[ec2Type]) {
      return res.status(400).json({ msg: 'EC2 type i pavlefshëm' });
    }
 
    const kostoEC2    = CMIMET[ec2Type] * Number(ec2Ore);
    const kostoS3     = S3_PER_GB * Number(s3GB);
    const kostoMujore = parseFloat((kostoEC2 + kostoS3).toFixed(2));
 
    const startup = await Startup.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ec2Type, ec2Ore: Number(ec2Ore), s3GB: Number(s3GB), kostoMujore },
      { new: true }
    );
 
    if (!startup) return res.status(404).json({ msg: 'Konfigurimi nuk u gjet' });
 
    res.json({ startup, kostoMujore });
  } catch (err) {
    console.error('EDIT ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim editimi: ' + err.message });
  }
});
 
// ── FSHI KONFIGURIM ───────────────────────────────────────────────────────────
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const startup = await Startup.findOneAndDelete({
      _id: req.params.id, userId: req.userId
    });
    if (!startup) return res.status(404).json({ msg: 'Konfigurimi nuk u gjet' });
    res.json({ msg: 'Konfigurimi u fshi' });
  } catch (err) {
    res.status(500).json({ msg: 'Gabim fshirje: ' + err.message });
  }
});
 
// ── VENDOS / NDRYSHO LIMIT ────────────────────────────────────────────────────
router.post('/limit', auth, async (req, res) => {
  try {
    const { limitKosto } = req.body;
 
    // Validim
    const limit = parseFloat(limitKosto);
    if (isNaN(limit) || limit < 0) {
      return res.status(400).json({ msg: 'Limiti duhet të jetë një numër pozitiv' });
    }
 
    const user = await User.findByIdAndUpdate(
      req.userId,
      { limitKosto: limit },
      { new: true }
    ).select('limitKosto emri');
 
    if (!user) return res.status(404).json({ msg: 'Perdoruesi nuk u gjet' });
 
    res.json({
      msg: limit === 0 ? 'Limiti u hoq' : `Limiti u vendos në $${limit}/muaj`,
      limitKosto: user.limitKosto
    });
  } catch (err) {
    console.error('LIMIT ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim vendosje limiti: ' + err.message });
  }
});
 
module.exports = router;