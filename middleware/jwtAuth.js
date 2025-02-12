const jwt = require('jsonwebtoken');
const database = require('../models/database');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

/*//*/
/*/function authenticateToken(req, res, next) {
    const token = req.cookies.auth_token;

    if (!token) {
        console.log("Nincs token a kérésben!");
        return res.status(403).json({ error: 'Nincs bejelentkezett felhasználó' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Hiba a token ellenőrzése közben:", err);
            return res.status(403).json({ error: 'A token érvénytelen' });
        }

        console.log("Token érvényes, felhasználói adat:", user);
        req.user = user;
        next();
    });
};/*/
function authenticateToken(req, res, next) {
    const token = req.cookies.auth_token;
    console.log(token);

    if (!token) {
        return res.status(403).json({ error: 'Nincs bejelentkezett felhasználó' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'A token érvénytelen' });
        }

        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;