// a telepített csomik
const express = require ('express')
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

//készített csomik
const limiter = require('./middleware/limiter');
const authenticateToken = require('./middleware/jwtAuth');


//útvonalak
const authRoutes = require('./routes/authRoutes');
const likeRoutes = require('./routes/likedRoutes');
const productsRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemsRoutes = require('./routes/orderItemsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartItemsRoutes = require('./routes/cartItemsRoutes');
//const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
//const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const productDescriptionRoutes = require('./routes/productDescriptionRoutes');
const editProfileRoutes = require("./routes/profileRoutes");
const searchRoutes = require('./routes/searchRoutes');

const app = express();


//middleware
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(limiter);
app.use(cookieParser());
app.use(cors({
    origin: 'https://nameuserer.github.io',
    credentials: true
}));

//fájlok
app.use('/uploads', authenticateToken,express.static(path.join(__dirname, 'uploads')));

//útvonalak használata
app.use('/api/auth', authRoutes);
app.use("/api/profile", editProfileRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order_items', orderItemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/cart-items', cartItemsRoutes);
//app.use("/api/auth", forgotPasswordRoutes);  // Forgot password route
//app.use("/api/auth", resetPasswordRoutes);   // Reset password route
app.use('/', productDescriptionRoutes);
app.use('/api', searchRoutes);




module.exports = app;