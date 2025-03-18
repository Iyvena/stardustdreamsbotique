const database = require('../models/database');

// kedvenekhez adás
const likeProduct = (req, res) => {
    const { product_id } = req.params;
    console.log(product_id, "likeproductnál productid-s gond");
    const user_id = req.user.id;
    console.log(user_id, "itt pedig a userid ugyanugy a likeproductnál");

    
    if (!product_id) {
        return res.status(400).json({ error: 'A termék ID-ja szükséges' });
    }

   
    const checkSql = 'SELECT * FROM likes WHERE user_id = ? AND product_id = ?';
    database.query(checkSql, [user_id, product_id], (err, result) => {
        if (err) {
            console.error('SQL Hiba a likes ellenőrzésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.length > 0) {
            
            const deleteSql = 'DELETE FROM likes WHERE user_id = ? AND product_id = ?';
            database.query(deleteSql, [user_id, product_id], (err, result) => {
                if (err) {
                    console.error('SQL Hiba a kedvenc eltávolításakor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }

                res.status(200).json({
                    message: 'A kedvenc sikeresen eltávolítva',
                    action: 'unliked', 
                    product_id: product_id
                });
            });
        } else {
            
            const insertSql = 'INSERT INTO likes (user_id, product_id) VALUES (?, ?)';
            database.query(insertSql, [user_id, product_id], (err, result) => {
                if (err) {
                    console.error('SQL Hiba a kedvenc hozzáadásakor:', err);
                    return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
                }

                res.status(200).json({
                    message: 'A kedvenc sikeresen hozzáadva',
                    action: 'liked', 
                    product_id: product_id
                });
            });
        }
    });
};

// Kedvenc eltávolítása
const unlikeProduct = (req, res) => {
    const { product_id } = req.body;
    console.log(product_id, "unlikeproductnál, productid");
    const user_id = req.user.id;
    console.log(user_id, "unlikeproduct userid");

    if (!product_id) {
        return res.status(400).json({ error: 'A termék ID-ja szükséges' });
    }

    const sql = 'DELETE FROM likes WHERE user_id = ? AND product_id = ?';
    database.query(sql, [user_id, product_id], (err, result) => {
        if (err) {
            console.error('SQL Hiba a kedvenc eltávolításakor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Kedvenc sikeresen eltávolítva' });
        } else {
            res.status(404).json({ error: 'A kedvenc nem található' });
        }
    });
};


// Kedvenc ellenőrzése
const checkLike = (req, res) => {
    const user_id = req.user.id;
    console.log(user_id, "checklikenál userid");

    const sql = 'SELECT * FROM likes WHERE user_id = ?';
    database.query(sql, [user_id, product_id], (err, result) => {
        if (err) {
            console.error('SQL Hiba a kedvenc státusz lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        res.status(200).json(result);
    });
};

module.exports = { likeProduct, checkLike, unlikeProduct };