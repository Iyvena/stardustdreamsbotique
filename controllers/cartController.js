const database = require('../models/database');
//kosár kreálás
const purchaseProduct = (req, res) => {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ error: 'Hiányzó adatok a vásárláshoz' });
    }

    // Kosár ellenőrzése és termék hozzáadása
    const checkCartSql = 'SELECT cart_id FROM cart WHERE user_id = ?';
    database.query(checkCartSql, [user_id], (err, cartResult) => {
        if (err) {
            console.error('Hiba a kosár ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        let cart_id;
        if (cartResult.length > 0) {
            cart_id = cartResult[0].cart_id;
            addToCart(cart_id, product_id, quantity, res); // Add item to cart
        } else {
            const insertCartSql = 'INSERT INTO cart (user_id) VALUES (?)';
            database.query(insertCartSql, [user_id], (err, result) => {
                if (err) {
                    console.error('Hiba a kosár létrehozásakor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }
                cart_id = result.insertId;
                addToCart(cart_id, product_id, quantity, res); // Add item to newly created cart
            });
        }
    });
};

// A termék hozzáadása a kosárhoz vagy frissítése
const addToCart = (cart_id, product_id, quantity, res) => {
    const checkItemSql = 'SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?';

    database.query(checkItemSql, [cart_id, product_id], (err, itemResult) => {
        if (err) {
            console.error('Hiba a termék ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (itemResult.length > 0) {
            // Ha már van ilyen termék a kosárban, frissítjük a mennyiséget
            const newQuantity = itemResult[0].quantity + quantity;
            const updateSql = 'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?';
            database.query(updateSql, [newQuantity, cart_id, product_id], (err) => {
                if (err) {
                    console.error('Hiba a termék frissítésekor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }
                return res.status(200).json({ message: 'Termék mennyisége frissítve a kosárban' });
            });
        } else {
            // Ha nincs benne, akkor hozzáadjuk
            const insertSql = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)';
            database.query(insertSql, [cart_id, product_id, quantity], (err) => {
                if (err) {
                    console.error('Hiba a termék hozzáadásakor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }
                return res.status(201).json({ message: 'Termék hozzáadva a kosárhoz' });
            });
        }
    });
};

// Kosár ellenőrzése
const checkCart = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT cart_items.cart_id, cart_items.product_id, products.product_name, products.price, 
               products.type_id, products.chategory_id, products.description,
               cart_items.quantity, (cart_items.quantity * products.price) AS total_price, products.product
        FROM cart_items
        JOIN cart ON cart_items.cart_id = cart.cart_id
        JOIN products ON cart_items.product_id = products.product_id
        WHERE cart.user_id = ?;
    `;

    database.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Hiba a kosár lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        res.status(200).json(result);
    });
};

// Termék eltávolítása a kosárból
const removeItemFromCart = (req, res) => {
    const user_id = req.user.id;
    const product_id = req.params.product_id;

    if (!product_id) {
        return res.status(400).json({ error: "Hiányzó product_id az URL-ben" });
    }

    const deleteItemSql = `
        DELETE FROM cart_items 
        WHERE product_id = ? AND cart_id IN (
            SELECT cart_id FROM cart WHERE user_id = ?
        )
    `;

    database.query(deleteItemSql, [product_id, user_id], (err, result) => {
        if (err) {
            console.error('Hiba a termék törlésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A termék nem található a kosárban' });
        }

        return res.status(200).json({ message: 'A termék sikeresen eltávolítva a kosárból' });
    });
};

const updateQuantity = (req, res) => {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ error: 'Hiányzó adatok a mennyiség frissítéséhez' });
    }

    // Ellenőrizzük, hogy van-e ilyen termék a kosárban
    const checkItemSql = 'SELECT * FROM cart_items WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?) AND product_id = ?';

    database.query(checkItemSql, [user_id, product_id], (err, result) => {
        if (err) {
            console.error('Hiba a termék ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'A termék nincs a kosárban' });
        }

        // Mennyiség frissítése
        const updateQuantitySql = 'UPDATE cart_items SET quantity = ? WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?) AND product_id = ?';

        database.query(updateQuantitySql, [quantity, user_id, product_id], (err) => {
            if (err) {
                console.error('Hiba a mennyiség frissítésekor:', err);
                return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
            }

            return res.status(200).json({ message: 'Mennyiség frissítve a kosárban' });
        });
    });
};

const checkout = (req, res) => {
    const user_id = req.user.id;
    const { email, card_token, shipping_address } = req.body;

    // Validáció
    if (!email || !card_token || !shipping_address) {
        return res.status(400).json({ error: 'Hiányzó adatok a vásárláshoz (email, bankkártya, cím)' });
    }

    // Lekérdezzük a kosár tartalmát
    const getCartSql = `
        SELECT cart_items.cart_id, cart_items.product_id, products.product_name, cart_items.quantity, products.price,
               (cart_items.quantity * products.price) AS total_price
        FROM cart_items
        JOIN cart ON cart_items.cart_id = cart.cart_id
        JOIN products ON cart_items.product_id = products.product_id
        WHERE cart.user_id = ?;
    `;

    database.query(getCartSql, [user_id], (err, result) => {
        if (err) {
            console.error("Hiba a kosár lekérdezésekor:", err);
            return res.status(500).json({ error: "Hiba az SQL-ben", details: err });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: "A kosár üres!" });
        }

        // Simulált fizetés – itt történne a fizetés hitelesítése pl. Stripe-pal
        console.log("Fizetés feldolgozása...");
        console.log("Email:", email);
        console.log("Kártya token:", card_token);
        console.log("Szállítási cím:", shipping_address);

        // Ha fizetés sikeres, töröljük a kosarat
        const clearCartSql = `DELETE FROM cart_items WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?)`;
        database.query(clearCartSql, [user_id], (deleteErr) => {
            if (deleteErr) {
                console.error("Hiba a kosár ürítésekor:", deleteErr);
                return res.status(500).json({ error: "Nem sikerült törölni a kosár tartalmát.", details: deleteErr });
            }

            // Visszaküldjük a vásárolt termékeket
            const purchasedItems = result.map(item => ({
                product_name: item.product_name,
                quantity: item.quantity,
                total_price: item.total_price
            }));

            return res.status(200).json({
                message: "Sikeres vásárlás!",
                user_email: email,
                shipping_address,
                products: purchasedItems
            });
        });
    });
};

// egy termék eltávolítása a kosárból teljesen (mindegy milyen mennyiség van benne)
deleteCartItem = (req, res) => {
    const { product_id } = req.params;
    console.log(product_id);

    const sql = 'DELETE FROM cart_items WHERE cart_item_id = ?';

    database.query(sql, [product_id], (err, result) => {
        if (err) {
            console.log('Hiba egy bizonyos termék összes mennyiségének törlésekor.', err);
            return res.status(500).json({ error: 'Nem sikerült a törlés!', err });
        }
        console.log('DELETE FROM cart_items WHERE cart_item_id = ? eredménye: ');
        console.log(result);
        
        return res.status(204).send();
    });

};
    


module.exports = { purchaseProduct, removeItemFromCart, checkCart, addToCart, updateQuantity, checkout, deleteCartItem };