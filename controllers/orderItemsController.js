const database = require('../models/database');

//rendeléshez a termékek hozzáadása
const createOrderItem = (req, res) => {
    const { order_id, product_id, quantity, price } = req.body;

    
    if (!order_id || !product_id || !quantity || !price) {
        return res.status(400).json({ error: 'Hiányzó adat a rendelési tételhez' });
    }

    
    const checkProductExistSql = 'SELECT * FROM products WHERE product_id = ?';
    database.query(checkProductExistSql, [product_id], (err, result) => {
        if (err) {
            console.error('Hiba a termék ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

       
        if (result.length === 0) {
            return res.status(400).json({ error: 'A megadott termék nem létezik' });
        }

       
        const insertOrderItemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
        database.query(insertOrderItemSql, [order_id, product_id, quantity, price], (err, result) => {
            if (err) {
                console.error('Hiba a rendelési tétel hozzáadásakor:', err);
                return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
            }

            res.status(201).json({ message: 'Rendelési tétel sikeresen hozzáadva' });
        });
    });
};


module.exports = { createOrderItem };