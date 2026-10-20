const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'school-feedback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8
    }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        req.session.returnTo = '/dashboard';
        return res.redirect('/auth/login');
    }

    try {
        const [tickets] = await db.query(
            'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );

        const stats = {
            total: tickets.length,
            submitted: tickets.filter(t => t.status === 'Submitted').length,
            inProgress: tickets.filter(t => ['Under Review', 'In Progress'].includes(t.status)).length,
            resolved: tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length
        };

        return res.render('user/dashboard', { tickets, stats, user: req.session.user });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error while loading your dashboard.');
    }
});

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});