const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email Verifikimi
const dergoEmailVerifikim = async (email, emri, token) => {
  const url = `http://localhost:5000/api/auth/verify/${token}`;
  
  await transporter.sendMail({
    from: `"CloudCost" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifiko Email-in tënd — CloudCost',
    priority: 'high',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High'
    },
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4361ee, #7b5ea7); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">☁️ CloudCost</h1>
        </div>
        <h2 style="color: #1a1a2e;">Mirë se vjen, ${emri}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Faleminderit që u regjistrove te CloudCost. Kliko butonin më poshtë për të verifikuar email-in tënd.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background: #4361ee; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
            ✅ Verifiko Email-in
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          Nëse nuk regjistrove ti, injorojë këtë email.<br>
          Ky link skadon pas 24 orësh.
        </p>
      </div>
    `
  });
};

// Email Notifikim Login
const dergoEmailLogin = async (email, emri) => {
  const data = new Date().toLocaleString('sq-AL');
  
  await transporter.sendMail({
    from: `"CloudCost" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Hyrje e re në CloudCost',
    priority: 'high',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High'
    },
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4361ee, #7b5ea7); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0;">☁️ CloudCost</h1>
        </div>
        <h2 style="color: #1a1a2e;">Mirë se erdhe, ${emri}!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          U krye një hyrje e re në llogarinë tënde CloudCost.
        </p>
        <div style="background: #f0f7ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #1e3a5f;">
            📅 <strong>Data dhe ora:</strong> ${data}
          </p>
        </div>
        <p style="color: #999; font-size: 14px;">
          Nëse nuk ishe ti — ndrysho fjalëkalimin menjëherë.
        </p>
      </div>
    `
  });
};

module.exports = { dergoEmailVerifikim, dergoEmailLogin };