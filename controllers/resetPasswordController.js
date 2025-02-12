/*const database = require("../models/database");  // A MySQL adatbázis kapcsolat

// A resetPassword logika
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Ellenőrizzük, hogy érvényes a reset token
        const [user] = await database.promise().query('SELECT * FROM users WHERE resetToken = ?', [token]);
        
        if (!user || user.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // A jelszó frissítése az adatbázisban
        await database.promise().query('UPDATE users SET password = ?, resetToken = NULL WHERE resetToken = ?', [newPassword, token]);

        return res.json({ message: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { resetPassword };*/