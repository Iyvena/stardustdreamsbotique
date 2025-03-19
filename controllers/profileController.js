const database = require('../models/database');
const bcrypt = require('bcryptjs');

//profile name change
const editProfileName = (req, res) => {
    const { username } = req.body;  
    const user_id = req.user.id;  
    console.log(username, user_id, "editprofilenamenél username vagy userid baj");

    if (!username || username.trim() === "") {
        return res.status(400).json({ error: "A név nem lehet üres." });
    }

   
    const sql = 'UPDATE users SET username = COALESCE(NULLIF(?, ""), username) WHERE user_id = ?';

   
    database.query(sql, [username, user_id], (err, result) => {
        if (err) {
            console.error("SQL hiba:", err);
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

       
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Felhasználó nem található az adatbázisban' });
        }

        
        return res.status(200).json({ message: 'Név frissítve' });
    });
};

//profil updates
const editProfilePassword = (req, res) => {
    const password = req.body.password;
    const user_id = req.user.id;
    console.log(password, user_id, "editprofilepasswordnél password vagy userid baj");

    const salt = 10;

    if (password === '' && !validator.isLenght(password, { min: 8})) {
        return res.status(400).json({error: 'a jelszónak minimum 8 karakternek kell lennie'});
    }

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'hiba a sózáskor'});
        }

        const sql = 'UPDATE users SET password = COALESCE(NULLIF(?, ""), password) WHERE user_id = ?';

        database.query(sql, [hash, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({error: 'Hiba az SQL-ben'});
            }

            return res.status(200).json({message: 'jelszó sikeresen frisstive'});
        });
    });
};

//adress módosítása 

const editProfileAdress = (req, res) => {
    const { address } = req.body; 
    const user_id = req.user.id;
    console.log(address, user_id, "editprofileadressnél adress vagy userid baj");

    
    if (!address || address.trim() === '') {
        return res.status(400).json({ error: 'A cím nem lehet üres' });
    }
    

    const sql = 'UPDATE users SET address = COALESCE(NULLIF(?, ""), address) WHERE user_id = ?';

    database.query(sql, [address, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Felhasználó nem található' });
        }

        return res.status(200).json({ message: 'Cím sikeresen frissítve' });
    });
};

//profilepic change
const editProfilePic = (req, res) => {
    const user_id = req.user.id;
    const profile_pic =req.file ? req.file.filename : null;

    console.log(user_id, profile_pic, "editprofilepicnél userid or profilepic baj");

    const sql = 'UPDATE users SET profile_pic = COALESCE(NULLIF(?, ""), profile_pic) WHERE user_id = ?';

    database.query(sql, [profile_pic, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({error: 'Hiba az SQL-ben'});
        }

        return res.status(200).json({ message: 'profilkép sikeresen frissítve'});
    });
};

//profilepic show
const getProfilePic = (req, res) => {
    const user_id = req.user.id;
    console.log(user_id, "getpfppic userid-s gond");

    const sql = 'SELECT profile_pic FROM users WHERE user_id = ?';
    database.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben'});
        }
        if (result.lenght === 0) {
            return res.status(404).json({ error: 'a felhasznló nem található, vagy nem létezik'});
        }

        return res.status(200).json(result);
    });
};

const getUsername = (req, res) => {
    const user_id = req.user.id; // Feltételezve, hogy az azonosított user ID elérhető a req.user-ben
    console.log(user_id, "getUsername userid-s gond");

    const sql = 'SELECT username FROM users WHERE user_id = ?';
    database.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL lekérdezésben' });
        }
        if (result.length === 0) { // Itt volt egy elírás nálad: "lenght" -> "length"
            return res.status(404).json({ error: 'A felhasználó nem található vagy nem létezik' });
        }

        return res.status(200).json(result[0]); // Csak az első találatot küldjük vissza
    });
};

const getAddress = (req, res) => {
    const user_id = req.user.id; // Feltételezve, hogy az azonosított user ID elérhető a req.user-ben
    console.log(user_id, "getAddress userid-s gond");

    const sql = 'SELECT address FROM users WHERE user_id = ?';
    database.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL lekérdezésben' });
        }
        if (result.length === 0) { 
            return res.status(404).json({ error: 'A felhasználó nem található vagy nem létezik' });
        }

        return res.status(200).json(result[0]); // Csak az első találatot küldjük vissza
    });
};


module.exports = { editProfileName, editProfilePassword, editProfileAdress, editProfilePic, getProfilePic, getUsername, getAddress };