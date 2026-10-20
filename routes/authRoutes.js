const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validRoles = ['student', 'faculty', 'staff', 'admin'];

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
}

router.get('/register', (req, res) => {
    res.render('auth/register', { error: null, successMessage: null });
});

router.post('/register', async (req, res) => {
    try {
        const name = (req.body.name || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const password = (req.body.password || '').trim();
        const confirmPassword = (req.body.confirmPassword || '').trim();
        const role = validRoles.includes(req.body.role) ? req.body.role : 'student';

        if (!name || name.length < 2) {
            return res.render('auth/register', {
                error: 'Full name must be at least 2 characters long.',
                successMessage: null
            });
        }

        if (!emailPattern.test(email)) {
            return res.render('auth/register', {
                error: 'Please enter a valid email address.',
                successMessage: null
            });
        }

        if (password.length < 6) {
            return res.render('auth/register', {
                error: 'Password must be at least 6 characters long.',
                successMessage: null
            });
        }

        if (password !== confirmPassword) {
            return res.render('auth/register', {
                error: 'Passwords do not match.',
                successMessage: null
            });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
        if (existing.length > 0) {
            return res.render('auth/register', {
                error: 'This email is already registered in the system.',
                successMessage: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        return res.render('auth/login', {
            error: null,
            successMessage: 'Registration successful. Please log in with your new account.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during registration.');
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login', {
        error: req.query.error || null,
        successMessage: null
    });
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', {
        error: null,
        successMessage: null
    });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();

        if (!emailPattern.test(email)) {
            return res.render('auth/forgot-password', {
                error: 'Please enter a valid email address.',
                successMessage: null
            });
        }

        const [rows] = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);

        if (rows.length > 0) {
            console.log(`Password reset requested for ${email}`);
        }

        return res.render('auth/forgot-password', {
            error: null,
            successMessage: 'If this email is registered, a password reset link has been sent.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while processing password reset request.');
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = (req.body.password || '').trim();

        if (!emailPattern.test(email)) {
            return res.render('auth/login', {
                error: 'Please enter a valid email address.',
                successMessage: null
            });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
        const user = rows[0];

        if (!user) {
            return res.render('auth/login', {
                error: 'Invalid email or password.',
                successMessage: null
            });
        }

        const isPasswordValid = user.password.startsWith('$2b$')
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

        if (!isPasswordValid) {
            return res.render('auth/login', {
                error: 'Invalid email or password.',
                successMessage: null
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const redirectTarget = req.session.returnTo || (user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        delete req.session.returnTo;
        return res.redirect(redirectTarget);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during login.');
    }
});

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.session.user.id]);
        if (rows.length === 0) {
            return res.redirect('/auth/login');
        }

        res.render('user/profile', { user: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while loading profile.');
    }
});

router.get('/settings', isAuthenticated, (req, res) => {
    res.render('user/settings', {
        user: req.session.user,
        error: null,
        successMessage: null
    });
});

router.post('/settings', isAuthenticated, async (req, res) => {
    try {
        const name = (req.body.name || '').trim();

        if (name.length < 2 || name.length > 100) {
            return res.status(400).render('user/settings', {
                user: req.session.user,
                error: 'Name must be between 2 and 100 characters.',
                successMessage: null
            });
        }

        const [result] = await db.query('UPDATE users SET name = ? WHERE id = ?', [name, req.session.user.id]);
        if (result.affectedRows === 0) {
            const [users] = await db.query('SELECT id FROM users WHERE id = ?', [req.session.user.id]);
            if (users.length === 0) {
                return res.status(404).send('User account was not found.');
            }
        }

        req.session.user.name = name;
        return res.render('user/settings', {
            user: req.session.user,
            error: null,
            successMessage: 'Your profile settings have been saved.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while saving settings.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;