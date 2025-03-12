const database = require('../models/database');

//rendelés létre hozása
const createOrder = (req, res) => {
    const { user_id, total } = req.body;
    console.log(user_id, total, "createordernél userid baj vagy total");
    const order_date = new Date();
    
    if (!user_id || !total) {
        return res.status(400).json({ error: 'A rendeléshez szükséges adatok hiányoznak' });
    }

    
    const getLastOrderIdSql = 'SELECT MAX(order_id) AS last_order_id FROM orders';
    database.query(getLastOrderIdSql, (err, result) => {
        if (err) {
            console.error('Hiba az utolsó order_id lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
        }

        
        const newOrderId = result[0].last_order_id ? result[0].last_order_id + 1 : 1;

       
        const insertOrderSql = 'INSERT INTO orders (order_id, user_id, order_date, total) VALUES (?, ?, ?, ?)';
        database.query(insertOrderSql, [newOrderId, user_id, order_date, total], (err, result) => {
            if (err) {
                console.error('Hiba a rendelés beszúrásakor:', err);
                return res.status(500).json({ error: 'Hiba az SQL-ben', details: err });
            }

            res.status(201).json({ message: 'Rendelés sikeresen létrehozva', order_id: newOrderId });
        });
    });
};


module.exports = { createOrder };