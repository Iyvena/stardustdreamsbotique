const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const database = require('../models/database');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

//register
const register = (req, res) => {
    const { email, username, password } = req.body;
    console.log("Email:", email, "Username:", username, "Password:", password, " registernél email,usernames vagy passwordos gond");
    const errors = [];

    if (!validator.isEmail(email)){
        errors.push({ error: 'nem létező email cím, kérlek adj meg egy létezőt.'})
    }

    if (validator.isEmpty(username)) {
        errors.push({ error: 'Adj egy nevet, hogy hogyan szólíthatunk'});
    }

    if(!validator.isLength(password, {min: 8})) {
        errors.push({ error: 'A jelszódnak minimum 8 karakterből kell állnia'});
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const salt = 10;
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'hiba található a sorozáskor'});
        }
        const sql = 'INSERT INTO users (user_id, username, email, password, profile_pic) VALUES (NULL, ?, ?, ?, "default.png")';
        database.query(sql, [username, email, hash], (err2, result) => {
            if(err2) {
                return res.status(500).json({error: 'Ez az email amit megadtál, már foglalt'});
            }

            res.status(201).json({ message: 'Sikeres regisztráció'});
        });
    });
};

//login
const login = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password, "loginnél emailes or passwordos gond");
    const errors = [];

    if (!validator.isEmail(email)) {
        errors.push({ error: 'Kérlek add meg az emailcímed' });
    }

    if(validator.isEmpty(password)) {
        errors.push({ error: 'Add meg a jelszavadat' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const sql = 'SELECT * FROM users WHERE email LIKE ?';
    database.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található, vagy nem létezik' });
        }

        const user = result[0];
        console.log(user,"valami");
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                const token = jwt.sign(
                    {
                        id: user.user_id,
                        username: user.username,
                        role: user.role, 
                    },
                    JWT_SECRET,
                    {
                        expiresIn: '1h', 
                    }
                );

                
                res.cookie('auth_token', token, {
                    httpOnly: true,
                    secure: true,  // HTTPS csak ha production
                    sameSite: 'lax',  // Ha külön domainen fut a frontend
                    maxAge: 3600000 * 24 * 31 * 12, // 1 év
                });

                return res.status(200).json({ message: 'Sikeres bejelentkezés', token });
            } else {
                return res.status(401).json({ error: 'Téves jelszó, kérlek próbáld meg újra' });
            }
        });
    });
};

//logout
const logout = (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ message: 'sikeres kijelentkezés'});
};

//admin login
const loginUser = (req, res) => {
    const { username, password } = req.body;
    console.log(username, password, "loginUsernél username vagy passwordos gond");

    const sql = 'SELECT * FROM users WHERE username = ?';
    database.query(sql, [username], (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).json({ error: 'Felhasználó nem található' });
        }

        const user = result[0];

        
        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) {
                return res.status(401).json({ error: 'Hibás jelszó' });
            }

            
            const token = jwt.sign(
                { id: user.user_id, username: user.username, role: user.role },  
                JWT_SECRET,
                { expiresIn: '1h' }  
            );

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: true,  // HTTPS csak ha production
                sameSite: 'lax',  // Ha külön domainen fut a frontend
                maxAge: 3600000 * 24 * 31 * 12, // 1 év
            });
            res.status(200).json({ message: 'Sikeres bejelentkezés', token });
        });
    });
};

const isAdmin = (req, res, next) => {
    console.log(req.user.role);
    
    if (req.user.role !== 'admin') { 
        return res.status(403).json({ error: 'Nincs jogosultságod a termék feltöltésére.' });
    }
    next();  
};

const isLoggedIn = (req, res) => {
    if (req.cookies.auth_token) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
}

module.exports = { register, login, logout, isAdmin, loginUser, isLoggedIn };