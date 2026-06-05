// Middleware qe lejon vetem adminat
module.exports = (req, res, next) => {
  if (req.roli !== 'admin') {
    return res.status(403).json({ msg: 'Akses i ndaluar — vetëm adminët' });
  }
  next();
};
 