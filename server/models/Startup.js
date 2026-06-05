const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emri:        { type: String, required: true },
  ec2Type:     { type: String, required: true },
  ec2Ore:      { type: Number, required: true },
  s3GB:        { type: Number, required: true },
  kostoMujore: { type: Number },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', StartupSchema);