const database = require("../models/database");

exports.processCheckout = (req, res) => {
    const user_id = req.user.id;

    // Lekérdezzük a kosár tartalmát
    const getCartSql = `
        SELECT products.product_name
        FROM cart_items
        JOIN products ON cart_items.product_id = products.product_id
        JOIN cart ON cart_items.cart_id = cart.cart_id
        WHERE cart.user_id = ?;
    `;

    database.query(getCartSql, [user_id], (err, result) => {
        if (err) {
            console.error("Hiba a kosár lekérdezésekor:", err);
            return res.status(500).json({ error: "Hiba az SQL-ben" });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: "A kosár üres!" });
        }

        const productNames = result.map(item => item.product_name).join(", ");

        // Kosár kiürítése a vásárlás után
        const clearCartSql = `
            DELETE FROM cart_items
            WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?);
        `;

        database.query(clearCartSql, [user_id], (deleteErr) => {
            if (deleteErr) {
                console.error("Hiba a kosár ürítésekor:", deleteErr);
                return res.status(500).json({ error: "Nem sikerült törölni a kosár tartalmát." });
            }

            // Sikeres válasz a frontendnek
            res.status(200).json({ message: "Sikeres vásárlás!", products: productNames });
        });
    });
};