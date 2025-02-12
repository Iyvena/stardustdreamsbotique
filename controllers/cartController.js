const database = require('../models/database');
//kosár kreálás
const createCart = (req, res) => {
    const { user_id } = req.body;
    console.log(user_id);

    if (!user_id) {
        return res.status(400).json({ error: 'A kosárhoz szükséges user_id' });
    }

    const insertCartSql = 'INSERT INTO cart (user_id) VALUES (?)';
    database.query(insertCartSql, [user_id], (err, result) => {
        if (err) {
            console.error('Hiba a kosár létrehozásakor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        res.status(201).json({ message: 'Kosár sikeresen létrehozva', cart_id: result.insertId });
    });
};
//eltávolítás a kosárból
const removeItemFromCart = (req, res) => {
    const { cart_item_id } = req.params;
    console.log(cart_item_id);

    if (!cart_item_id) {
        return res.status(400).json({ error: "Hiányzó cart_item_id" });
    }

    const deleteItemSql = 'DELETE FROM cart_items WHERE cart_item_id = ?';
    
    database.query(deleteItemSql, [cart_item_id], (err, result) => {
        if (err) {
            console.error('Hiba a termék törlésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A megadott cart_item_id nem található' });
        }

        res.status(200).json({ message: 'A termék sikeresen eltávolítva a kosárból' });
    });
};


module.exports = { createCart, removeItemFromCart };