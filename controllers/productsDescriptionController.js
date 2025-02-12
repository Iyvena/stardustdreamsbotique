const database = require('../models/database');
//leírás
const updateProductDescription = (req, res) => {
    const { product_id, description } = req.body;
    console.log(product_id, description);

    if (!product_id || !description) {
        return res.status(400).json({ error: 'Termék ID és leírás megadása szükséges' });
    }

    const updateDescriptionSql = 'UPDATE products SET description = ? WHERE product_id = ?';
    database.query(updateDescriptionSql, [description, product_id], (err, result) => {
        if (err) {
            console.error('Hiba a leírás frissítésekor:', err);
            return res.status(500).json({ error: 'Hiba történt a leírás frissítésekor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A termék nem található' });
        }

        res.status(200).json({ message: 'Termék leírása sikeresen frissítve!' });
    });
};

module.exports = { updateProductDescription };