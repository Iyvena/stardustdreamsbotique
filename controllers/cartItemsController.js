const database = require('../models/database');
//hozzáadni a termékeket a kosárhoz
const addToCart = (req, res) => {
    const { cart_id, product_id, quantity } = req.body;
    console.log(cart_id, product_id, quantity, "az addtocartnál cartid productid vagy esetleg quantity baj");

    if (!cart_id || !product_id || !quantity) {
        return res.status(400).json({ error: 'Hiányzó adatok a kosárhoz adásnál' });
    }

    
    const checkSql = 'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?';
    database.query(checkSql, [cart_id, product_id], (err, result) => {
        if (err) {
            console.error('Hiba a kosár ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.length > 0) {
            
            const updateSql = 'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?';
            database.query(updateSql, [quantity, cart_id, product_id], (err, result) => {
                if (err) {
                    console.error('Hiba a kosár frissítésekor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }

                res.status(200).json({ message: 'Termék mennyisége frissítve a kosárban' });
            });
        } else {
            
            const insertSql = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)';
            database.query(insertSql, [cart_id, product_id, quantity], (err, result) => {
                if (err) {
                    console.error('Hiba a termék kosárba helyezésekor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }

                res.status(201).json({ message: 'Termék hozzáadva a kosárhoz' });
            });
        }
    });
};

module.exports = { addToCart };