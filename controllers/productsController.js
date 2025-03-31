const database = require('../models/database');


//összes termék le kérdezése
const getALLproduct = (req, res) => {
    const user_id = req.user_id;
    console.log(user_id, "getallproductnál userid gond");
    //const sql = 'SELECT products.product_id, products.product_name, products.user_id, users.username, users.profile_pic, COUNT(likes.product_id) AS`like`, CASE WHEN EXISTS(SELECT 1 FROM likes WHERE likes.product_id = products.product_id AND likes.user_id = ?) THEN 1 ELSE 0 END AS alreadyLiked FROM products JOIN users ON products.user_id = users.user_id LEFT JOIN likes ON products.product_id = likes.product_id GROUP BY products.product_id'
    const sql = 'SELECT * FROM products';

    database.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        if (result.lenght === 0) {
            return res.status(404).json({ error: 'nincs még termék' });
        }

        return res.status(200).json(result);
    });
};

//új termék felvitele
const uploadProduct = (req, res) => {
    const user_id = req.user.id;
    console.log(`uploadProduct: ${user_id}`);
    
    if (!req.file) {
        return res.status(400).json({
            error: 'A fájl nem került feltöltésre. Kérlek válassz egy fájlt.'
        });
    }

    const { product_name, description, price, type_id, category_name } = req.body;
    console.log(product_name, description, price, type_id, category_name);
    const product = req.file.filename;
    console.log(product);

    if (!product_name || !price || !type_id || !category_name || !description || !product) {
        return res.status(400).json({
            error: 'Kérlek add meg az összes szükséges adatot (termék neve, ára, típusa, kategória neve, fájl)',
            details: {
                product_name,
                price,
                type_id,
                category_name,
                description,
                product
            }
        });
    }
    /*
    const getCategorySql = 'SELECT chategory_id FROM chategory WHERE chategory_name = ?';
    console.log(`51. sorban: ${category_name}`);
    
    database.query(getCategorySql, [category_name], (err, result) => {
        if (err) {
            console.log(`52. sor: ${err}`);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }
        console.log(`55. sor: ${result}`);
        
        if (result.length === 0) {
            return res.status(400).json({ error: 'Nincs ilyen kategória!' });
        }

        const chategory_id = result[0].chategory_id;
        console.log(chategory_id, "valamien chategoryid baj");
    */

    const sql = 'INSERT INTO products (product_id, product_name, price, product, type_id, chategory_id, user_id, description) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
    database.query(sql, [product_name, price, product, type_id, category_name, user_id, description], (err, result) => {
        if (err) {
            console.log(`68. sor: ${err}`);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }
        console.log(result);
        res.status(201).json({ message: 'Termék sikeresen feltöltve', product_id: result.insertId });
    });
};

//filter
const filterProducts = (req, res) => {
    const { category_id, type_id } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    let values = [];

    if (category_id) {
        sql += " AND category_id = ?";
        values.push(category_id);
    }

    if (type_id) {
        sql += " AND type_id = ?";
        values.push(type_id);
    }

    database.query(sql, values, (err, results) => {
        if (err) {
            console.error("Query error: ", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
};

// Termék törlése
const deleteProduct = (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        return res.status(400).json({ error: 'Nincs megadva termékazonosító (product_id).' });
    }

    // Először lekérdezzük a fájlnevet, hogy törölhessük a szerverről is
    const getProductSql = 'SELECT product FROM products WHERE product_id = ?';
    database.query(getProductSql, [product_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL lekérdezésben', details: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'A termék nem található.' });
        }

        const filename = result[0].product; // A fájlnév

        // Töröljük a képet a szerverről (ha szükséges)
        const fs = require('fs');
        const imagePath = `uploads/${filename}`; // Az útvonalat állítsd be, ahol a képek vannak
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Fájl törlése
        }

        // Termék törlése az adatbázisból
        const deleteSql = 'DELETE FROM products WHERE product_id = ?';
        database.query(deleteSql, [product_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Hiba az SQL törlésben', details: err });
            }

            res.status(200).json({ message: 'Termék sikeresen törölve' });
        });
    });
};

const updateProduct = (req, res) => {
    const user_id = req.user.id;
    const product_id = req.params.id;
    
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Csak admin frissítheti a termékeket!' });
    }

    const { product_name, description, price, type_id, category_name } = req.body;
    const product = req.file ? req.file.filename : null; // Ha van új fájl, frissítjük a képet

    if (!product_name || !price || !type_id || !category_name || !description) {
        return res.status(400).json({ error: 'Hiányzó adatok a frissítéshez.' });
    }

    let sql = `
        UPDATE products
        SET product_name = ?, description = ?, price = ?, type_id = ?, category_name = ?
        WHERE product_id = ? AND user_id = ?
    `;
    let values = [product_name, description, price, type_id, category_name, product_id, user_id];

    if (product) {
        sql = `
            UPDATE products
            SET product_name = ?, description = ?, price = ?, type_id = ?, category_name = ?, product = ?
            WHERE product_id = ? AND user_id = ?
        `;
        values = [product_name, description, price, type_id, category_name, product, product_id, user_id];
    }

    database.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az adatbázis művelet során.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A termék nem található vagy nincs jogosultságod.' });
        }

        return res.status(200).json({ message: 'Termék sikeresen frissítve!' });
    });
};

module.exports = { getALLproduct, uploadProduct, filterProducts, deleteProduct, updateProduct };