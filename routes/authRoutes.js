const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ==================== REGISTRATION ROUTES ====================

// GET /auth/register - Show registration page
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

// POST /auth/register - Process user registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if email already exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.render('auth/register', { error: 'Email is already registered.' });
        }

        // Insert new user into database
        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role || 'student']
        );

        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during registration.');
    }
});


// ==================== LOGIN ROUTES ====================

// GET /auth/login - Show login page
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

// POST /auth/login - Process login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0 || rows[0].password !== password) {
            return res.render('auth/login', { error: 'Invalid email or password.' });
        }

        const user = rows[0];

        // Save user data in session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during login.');
    }
});


// ==================== LOGOUT ROUTE ====================

// GET /auth/logout - Logout user
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;