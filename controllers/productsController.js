const database = require('../models/database');

//összes termék le kérdezése
const getALLproduct = (req, res) => {
    const user_id = req.user_id;
    console.log(user_id);
    const sql = 'SELECT products.product_id, products.product_name, products.user_id, users.username, users.profile_pic, COUNT(likes.product_id) AS`like`, CASE WHEN EXISTS(SELECT 1 FROM likes WHERE likes.product_id = products.product_id AND likes.user_id = ?) THEN 1 ELSE 0 END AS alreadyLiked FROM products JOIN users ON products.user_id = users.user_id LEFT JOIN likes ON products.product_id = likes.product_id GROUP BY products.product_id'

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
    console.log(product_name, price,type_id,chategory_name);
    const product = req.file.filename;
    console(product);

    

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
        console.log(chategory_id);

        
        const sql = 'INSERT INTO products (user_id, product_name, price, type_id, chategory_id, product) VALUES (?, ?, ?, ?, ?, ?)';
        database.query(sql, [req.user.id, product_name, price, type_id, chategory_id, product], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
            }

            res.status(201).json({ message: 'Termék sikeresen feltöltve', product_id: result.insertId });
        });
    });
};


module.exports = { getALLproduct, uploadProduct };