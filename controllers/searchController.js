const searchProducts = (req, res) => {
    let search = req.params.search || ''; // Ha nincs paraméter, akkor üres string
    search = search.trim();

    if (search === '') {
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