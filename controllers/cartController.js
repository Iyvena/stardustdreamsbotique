const database = require('../models/database');
//kosár kreálás
const createCart = (req, res) => {
    const user_id = req.user.id; // A user ID most már a JWT tokenből jön

    console.log(user_id, "cartnál a userid");

    if (!user_id) {
        return res.status(400).json({ error: 'Felhasználó azonosítása sikertelen' });
    }

    const checkCartSql = 'SELECT * FROM cart WHERE user_id = ?';
    database.query(checkCartSql, [user_id], (err, result) => {
        if (err) {
            console.error('Hiba a kosár ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.length > 0) {
            return res.status(200).json({
                message: 'Kosár már létezik',
                cart_id: result[0].cart_id
            });
        } else {
            const insertCartSql = 'INSERT INTO cart (user_id) VALUES (?)';
            database.query(insertCartSql, [user_id], (err, result) => {
                if (err) {
                    console.error('Hiba a kosár létrehozásakor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }

                res.status(201).json({
                    message: 'Kosár sikeresen létrehozva',
                    cart_id: result.insertId
                });
            });
        }
    });
};
//eltávolítás a kosárból
const removeItemFromCart = (req, res) => {
    const { cart_item_id } = req.params;
    console.log(cart_item_id, "cartból el távolításból cartitemID gond");

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

const checkCart = (req, res) => {
    const user_id = req.user.id;
    console.log(user_id, "checkCartnál user_id");

    const sql = `
        SELECT cart_items.cart_id, cart_items.product_id, products.product_name, products.price, 
               products.type_id, products.chategory_id, products.description,
               cart_items.quantity, (cart_items.quantity * products.price) AS total_price
        FROM cart_items
        JOIN cart ON cart_items.cart_id = cart.cart_id
        JOIN products ON cart_items.product_id = products.product_id
        WHERE cart.user_id = ?;
    `;

    database.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('SQL Hiba a kosár lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        res.status(200).json(result);
    });
};



module.exports = { createCart, removeItemFromCart, checkCart };