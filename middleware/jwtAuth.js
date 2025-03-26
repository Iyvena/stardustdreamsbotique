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

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Nincs token, hozzáférés megtagadva' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET a .env-ben legyen
        req.user = decoded; // Felhasználói adatok tárolása a requestben
        next();
    } catch (error) {
        res.status(401).json({ error: 'Érvénytelen token' });
    }
};

module.exports = authenticateToken, authenticateUser;