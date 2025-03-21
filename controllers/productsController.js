const database = require('../models/database');

//összes termék le kérdezése
const getALLproduct = (req, res) => {
    const user_id = req.user_id;
    console.log(user_id, "getallproductnál userid gond");
    //const sql = 'SELECT products.product_id, products.product_name, products.user_id, users.username, users.profile_pic, COUNT(likes.product_id) AS`like`, CASE WHEN EXISTS(SELECT 1 FROM likes WHERE likes.product_id = products.product_id AND likes.user_id = ?) THEN 1 ELSE 0 END AS alreadyLiked FROM products JOIN users ON products.user_id = users.user_id LEFT JOIN likes ON products.product_id = likes.product_id GROUP BY products.product_id'
    const sql = 'SELECT * FROM products';

    database.query(sql, [user_id], (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben'});
        }

        if (result.lenght === 0) {
            return res.status(404).json({ error: 'nincs még termék'});
        }

        return res.status(200).json(result);
    });
};

//új termék felvitele
const uploadProduct = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'A fájl nem került feltöltésre. Kérlek válassz egy fájlt.'
        });
    }

    const { product_name, price, type_id, chategory_name } = req.body;
    console.log(product_name, price,type_id,chategory_name, "uploadproductnál productname price typeid chategoryname baj");
    const product = req.file.filename;
    

    

    if (!product_name || !price || !type_id || !chategory_name || !product) {
        return res.status(400).json({
            error: 'Kérlek add meg az összes szükséges adatot (termék neve, ára, típusa, kategória neve, fájl)',
            details: {
                product_name,
                price,
                type_id,
                chategory_name,
                product
            }
        });
    }
    const getCategorySql = 'SELECT chategory_id FROM chategory WHERE chategory_name = ?';
    database.query(getCategorySql, [chategory_name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: 'Nincs ilyen kategória!' });
        }

        const chategory_id = result[0].chategory_id;
        console.log(chategory_id, "valamien chategoryid baj");

        
        const sql = 'INSERT INTO products (user_id, product_name, price, type_id, chategory_id, product) VALUES (?, ?, ?, ?, ?, ?)';
        database.query(sql, [req.user.id, product_name, price, type_id, chategory_id, product], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
            }

            res.status(201).json({ message: 'Termék sikeresen feltöltve', product_id: result.insertId });
        });
    });
};

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


module.exports = { getALLproduct, uploadProduct, filterProducts };