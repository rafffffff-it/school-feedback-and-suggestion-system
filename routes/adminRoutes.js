const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to check if user is logged in and is an admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied: Administrator privileges required. Please <a href="/auth/login">log in as admin</a>.');
}

// GET /admin/dashboard - View all feedback tickets (Protected by isAdmin middleware)
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        // Fetch all tickets ordered by newest first
        const [tickets] = await db.query('SELECT * FROM tickets ORDER BY created_at DESC');
        res.render('admin/dashboard', { tickets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while loading admin dashboard.');
    }
});

// POST /admin/ticket/:id/update - Update ticket status and remarks (Protected by isAdmin middleware)
router.post('/ticket/:id/update', isAdmin, async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { status, admin_remarks } = req.body;

        await db.query(
            'UPDATE tickets SET status = ?, admin_remarks = ? WHERE id = ?',
            [status, admin_remarks, ticketId]
        );

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while updating ticket status.');
    }
});

module.exports = router;