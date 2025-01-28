const bcrypt = require('bcrypt');
const database = require('../models/database');

const resetPassword = (req, res) => {
    const { resetToken, newPassword } = req.body;
  
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: "A token és az új jelszó megadása kötelező." });
    }
  
    const checkTokenQuery = 'SELECT user_id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()';
  
    database.query(checkTokenQuery, [resetToken], (err, result) => {
      if (err) {
        console.error("Adatbázis hiba:", err);
        return res.status(500).json({ error: "Adatbázis hiba történt.", details: err.message });
      }
  
      if (result.length === 0) {
        return res.status(400).json({ error: "Érvénytelen vagy lejárt token." });
      }
  
      const userId = result[0].user_id;
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
      const updatePasswordQuery = 'UPDATE users SET password = ? WHERE user_id = ?';
      database.query(updatePasswordQuery, [hashedPassword, userId], (err) => {
        if (err) {
          console.error("Jelszó frissítési hiba:", err);
          return res.status(500).json({ error: "Hiba történt a jelszó frissítésekor." });
        }
  
        return res.status(200).json({ message: "Jelszó sikeresen frissítve." });
      });
    });
  };
  
module.exports = { resetPassword };