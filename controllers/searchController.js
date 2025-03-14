const database = require('../models/database');

//termék keresése
const searchProducts = (req, res) => {
    const { search } = req.params;

    // Ha search nincs megadva vagy üres, akkor az összes terméket lekérjük
    if (!search || search.trim() === "") {
        const sql = 'SELECT * FROM products';

        database.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Adatbázis hiba' });
            }
            res.send(result);
        });
        return;
    }

    // Ha van keresési kifejezés, akkor LIKE feltétellel keresünk
    const keres = `%${search}%`;
    console.log(search, keres, "searchproductsnál search or keres baj");
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