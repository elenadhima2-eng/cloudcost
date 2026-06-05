const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
 
  if (!token)
    return res.status(401).json({ msg: 'Nuk je i loguar' });
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.roli   = decoded.roli;
    next();
  } catch {
    res.status(401).json({ msg: 'Token i pavlefshëm' });
  }
};
 