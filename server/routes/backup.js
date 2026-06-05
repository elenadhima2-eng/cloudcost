const express   = require('express');
const router    = express.Router();
const AWS       = require('aws-sdk');
const multer    = require('multer');
const auth      = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const s3 = new AWS.S3({
  accessKeyId:      process.env.AWS_ACCESS_KEY,
  secretAccessKey:  process.env.AWS_SECRET_KEY,
  region:           process.env.AWS_REGION || 'us-east-1',
  endpoint:         process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 50 * 1024 * 1024 }
});

async function siguroseBucket() {
  const bucket = process.env.AWS_BUCKET_NAME;
  try {
    await s3.headBucket({ Bucket: bucket }).promise();
  } catch (e) {
    if (e.statusCode === 404) {
      await s3.createBucket({ Bucket: bucket }).promise();
    }
  }
}

router.post('/upload', auth, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'Nuk u zgjodh asnjë file' });
    await siguroseBucket();
    const key = `${req.userId}/${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
    const params = {
      Bucket:      process.env.AWS_BUCKET_NAME,
      Key:         key,
      Body:        req.file.buffer,
      ContentType: req.file.mimetype || 'application/octet-stream'
    };
    const result = await s3.upload(params).promise();
    res.json({ msg: 'Backup u ngarkua me sukses', url: result.Location, key: result.Key });
  } catch (err) {
    res.status(500).json({ msg: 'Gabim ngarkimi: ' + err.message });
  }
});

router.get('/list', auth, adminOnly, async (req, res) => {
  try {
    await siguroseBucket();
    const data = await s3.listObjectsV2({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${req.userId}/`
    }).promise();
    res.json(data.Contents || []);
  } catch (err) {
    res.status(500).json({ msg: 'Gabim listim: ' + err.message });
  }
});

router.delete('/delete', auth, adminOnly, async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ msg: 'Key mungon' });
    if (!key.startsWith(req.userId + '/'))
      return res.status(403).json({ msg: 'Nuk ke leje' });
    await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
    res.json({ msg: 'Backup u fshi me sukses' });
  } catch (err) {
    res.status(500).json({ msg: 'Gabim fshirje: ' + err.message });
  }
});

module.exports = router;