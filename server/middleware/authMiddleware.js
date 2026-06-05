const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // Merret token nga Header (p.sh. Authorization: Bearer XYZ)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Nuk u gjet token, akses i mohuar." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Këtu ruhet ID-ja e përdoruesit
        next();
    } catch (error) {
        res.status(401).json({ message: "Token i pavlefshëm." });
    }
};

module.exports = { protect };