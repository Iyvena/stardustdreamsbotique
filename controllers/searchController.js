const database = require('../models/database');

//termék keresése
const searchProducts = (req, res) => {
    const { search } = req.params;
    const keres = `%${search}%`;
    const sql = 'SELECT * FROM products WHERE product_name LIKE ? OR description LIKE ? OR price LIKE ?';

    database.query(sql, [keres, keres, keres], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Adatbázis hiba' });
        }
        res.send(result);
    });
};

module.exports = { searchProducts };