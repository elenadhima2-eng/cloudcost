const mongoose = require('mongoose');
 
const UserSchema = new mongoose.Schema({
  emri:             { type: String,  required: true },
  email:            { type: String,  required: true, unique: true },
  fjalekalimi:      { type: String,  required: true },
  roli:             { type: String,  enum: ['admin', 'punonjes'], default: 'punonjes' },
  emailVerifikuar:  { type: Boolean, default: false },
  verifikimToken:   { type: String },
  limitKosto:       { type: Number,  default: 0 },
  createdAt:        { type: Date,    default: Date.now }
});
 
module.exports = mongoose.model('User', UserSchema);