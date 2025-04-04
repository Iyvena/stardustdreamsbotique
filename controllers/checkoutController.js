const database = require("../models/database");

const checkout = (req, res) => {
    const user_id = req.user.id;

    // Lekérdezzük a kosár tartalmát a vásárlás előtt
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

        // Kosár kiürítése a vásárlás után
        const clearCartSql = `DELETE FROM cart_items WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?)`;
        database.query(clearCartSql, [user_id], (deleteErr) => {
            if (deleteErr) {
                console.error("Hiba a kosár ürítésekor:", deleteErr);
                return res.status(500).json({ error: "Nem sikerült törölni a kosár tartalmát.", details: deleteErr });
            }

            // Visszaküldjük a vásárolt termékek listáját
            const purchasedItems = result.map(item => ({
                product_name: item.product_name,
                quantity: item.quantity,
                total_price: item.total_price
            }));

            return res.status(200).json({
                message: "Sikeres vásárlás!",
                products: purchasedItems
            });
        });
    });
};

module.exports = { checkout };