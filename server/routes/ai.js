const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Startup = require('../models/Startup');
//const { GoogleGenAI } = require('@google/genai');

//const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pyetGemini = async (prompt) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  console.log("OPENROUTER:", JSON.stringify(data));
  return data.choices[0].message.content;
};

// CHATBOX
router.post('/ask', auth, async (req, res) => {
  try {
    const { pyetja } = req.body;
    const prompt = `Ti je asistent i platformës CloudCost. Ndihmon startup-et me pyetje rreth kostove AWS dhe backup-eve. Përgjigju shkurt dhe qartë në shqip.\n\nPyetja: ${pyetja}`;
    const pergjigja = await pyetGemini(prompt);
    res.json({ pergjigja });
  } catch (err) {
    console.log('CHAT ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim ChatBox: ' + err.message });
  }
});

// ANALIZE KOSTOSH
router.post('/analyze', auth, async (req, res) => {
  try {
    const startups = await Startup.find({ userId: req.userId });
    if (startups.length === 0)
      return res.json({ analiza: 'Nuk ka konfigurime të regjistruara ende.' });

    const totalKosto = startups.reduce((sum, s) => sum + s.kostoMujore, 0).toFixed(2);

    const prompt = `Analizoje këtë situatë cloud për një startup dhe jep 2-3 rekomandime konkrete për optimizim kostosh. Përgjigju në shqip, shkurt dhe qartë.

Konfigurimet:
${startups.map(s => `- ${s.emri}: ${s.ec2Type}, ${s.ec2Ore} orë, ${s.s3GB}GB S3, $${s.kostoMujore}/muaj`).join('\n')}
Kosto totale mujore: $${totalKosto}`;

    const analiza = await pyetGemini(prompt);
    res.json({ analiza });
  } catch (err) {
    console.log('ANALYZE ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim analizë: ' + err.message });
  }
});

// DETEKTIM ANOMALISH
router.post('/anomaly', auth, async (req, res) => {
  try {
    const { kostoAktuale, kostoMesatare } = req.body;
    const ndryshimi = ((kostoAktuale - kostoMesatare) / kostoMesatare * 100).toFixed(1);

    if (Math.abs(ndryshimi) < 5)
      return res.json({ anomali: false, msg: 'Kostot janë normale.' });

    const prompt = `Kostoja cloud e muajit aktual është $${kostoAktuale}. Kostoja mesatare e muajve të kaluar është $${kostoMesatare}. Ndryshimi është ${ndryshimi}%. Shpjego shkaqet e mundshme dhe çfarë duhet bërë. Përgjigju në shqip, maksimum 3 fjali.`;

    const msg = await pyetGemini(prompt);
    res.json({ anomali: true, ndryshimi: `${ndryshimi}%`, msg });
  } catch (err) {
    console.log('ANOMALY ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim detektim: ' + err.message });
  }
});

// RAPORT MUJOR
router.post('/report', auth, async (req, res) => {
  try {
    const { startups, backups, totalKosto } = req.body;

    const prompt = `Gjenero një raport mujor profesional në shqip për këtë startup cloud:

KOSTOT:
${startups.map(s => `- ${s.emri}: ${s.ec2Type}, ${s.ec2Ore} orë, ${s.s3GB}GB S3, $${s.kostoMujore}/muaj`).join('\n')}
Kosto totale: $${totalKosto}

BACKUP-ET: ${backups.length} backup të ngarkuara
DATA: ${new Date().toLocaleDateString('sq-AL')}

Raporti duhet të përfshijë:
1. Përmbledhje ekzekutive
2. Analiza e kostove
3. Statusi i backup-eve
4. Rekomandime për optimizim
Maksimum 200 fjalë, profesional.`;

    const raporti = await pyetGemini(prompt);
    res.json({ raporti });
  } catch (err) {
    console.log('REPORT ERROR:', err.message);
    res.status(500).json({ msg: 'Gabim raport: ' + err.message });
  }
});

module.exports = router;