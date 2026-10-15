const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// 1. Homepage Route (Renders views/index.ejs)
app.get('/', (req, res) => {
    res.render('index'); 
});

// 2. Feedback Routes (Handles /feedback/new and /feedback/track)
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes);

// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);