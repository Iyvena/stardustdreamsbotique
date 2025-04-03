/*const database = require('../models/database');
//hozzáadni a termékeket a kosárhoz
const addToCart = (req, res) => {
    const user_id = req.user.id; // A user ID a JWT tokenből jön
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ error: 'Hiányzó adatok a kosárhoz adásnál' });
    }

    // 1️⃣ Kosár ID lekérdezése a user_id alapján
    const getCartSql = 'SELECT cart_id FROM cart WHERE user_id = ?';
    database.query(getCartSql, [user_id], (err, cartResult) => {
        if (err || cartResult.length === 0) {
            console.error('Hiba a kosár lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben vagy nincs kosár' });
        }

        const cart_id = cartResult[0].cart_id;

        // 2️⃣ Megnézzük, hogy benne van-e már a termék a kosárban
        const checkSql = 'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?';
        database.query(checkSql, [cart_id, product_id], (err, itemResult) => {
            if (err) {
                console.error('Hiba a kosár ellenőrzésekor:', err);
                return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
            }

            if (itemResult.length > 0) {
                // 3️⃣ Ha már van benne, akkor frissítjük a mennyiséget
                const updateSql = 'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?';
                database.query(updateSql, [quantity, cart_id, product_id], (err, result) => {
                    if (err) {
                        console.error('Hiba a kosár frissítésekor:', err);
                        return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                    }

                    return res.status(200).json({ message: 'Termék mennyisége frissítve a kosárban' });
                });
            } else {
                // 4️⃣ Ha nincs benne, akkor betesszük és kiszámoljuk az árat
                const priceSql = 'SELECT price FROM products WHERE product_id = ?';
                database.query(priceSql, [product_id], (err, priceResult) => {
                    if (err || priceResult.length === 0) {
                        console.error('Hiba a termék árának lekérdezésekor:', err);
                        return res.status(500).json({ error: 'Hiba az SQL-ben vagy nincs ilyen termék' });
                    }

                    const product_price = priceResult[0].price;
                    const total_price = product_price * quantity;

                    const insertSql = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)';
                    database.query(insertSql, [cart_id, product_id, quantity], (err, result) => {
                        if (err) {
                            console.error('Hiba a termék kosárba helyezésekor:', err);
                            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                        }

                        return res.status(201).json({ message: 'Termék hozzáadva a kosárhoz' });
                    });
                });
            }
        });
    });
};

module.exports = { addToCart };*/