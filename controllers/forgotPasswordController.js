const crypto = require('crypto');
const database = require('../models/database');

const forgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Az email megadása kötelező." });
    }

    const findUserQuery = 'SELECT user_id FROM users WHERE email = ?';

    database.query(findUserQuery, [email], (err, result) => {
        if (err) {
            console.error("Adatbázis hiba:", err);
            return res.status(500).json({ error: "Adatbázis hiba történt.", details: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "A megadott email cím nem található." });
        }

        const userId = result[0].user_id;

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = Date.now() + 3600000; // 1 óra lejárati idő

        const saveTokenQuery = `
            UPDATE users 
            SET reset_token = ?, reset_token_expires = ? 
            WHERE user_id = ?
        `;
        database.query(saveTokenQuery, [resetToken, tokenExpires, userId], (err) => {
            if (err) {
                console.error("Token mentési hiba:", err);
                return res.status(500).json({ error: "Hiba történt a token mentésekor." });
            }

            return res.status(200).json({
                message: "Token generálva. Használja a következő lépéshez.",
                resetToken: resetToken
            });
        });
    });
};

module.exports = { forgotPassword };