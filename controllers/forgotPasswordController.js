/*const nodemailer = require("nodemailer");
const database = require("../models/database");  // Adatbázis kapcsolat

// A transporter beállítása
const transporter = nodemailer.createTransport({
    service: "gmail",  
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
    },
});

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Received email:", email);  // Ellenőrizni, hogy tényleg jön-e az email

        // Ellenőrizzük, hogy létezik-e a felhasználó email címe
        const [user] = await database.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user || user.length === 0) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Reset token generálása
        const resetToken = Math.random().toString(36).substring(2, 15);
        console.log("Generated reset token:", resetToken);

        // Email küldése
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Please use the following token to reset your password: ${resetToken}`,
        };

        // Küldés próbálkozás
        try {
            await transporter.sendMail(mailOptions);  
            console.log("Email sent successfully!");  // Ez a log fog jelezni, hogy az email sikeresen el lett küldve
        } catch (error) {
            console.error("Email send error:", error);  // Hiba naplózása, ha valami nem sikerült
            return res.status(500).json({ message: "Error sending email", error });
        }

        // A reset token mentése az adatbázisba
        await database.promise().query('UPDATE users SET resetToken = ? WHERE email = ?', [resetToken, email]);

        return res.json({ message: "Password reset email sent!" });
    } catch (error) {
        console.error("Server error:", error);  // Ezt a log-ot akkor látod, ha más hiba van
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { forgotPassword };*/