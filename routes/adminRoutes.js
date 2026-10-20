const express = require('express');
const router = express.Router();
const db = require('../config/db');

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    res.status(403).render('auth/login', {
        error: 'Access Denied: Administrator privileges required.',
        successMessage: null
    });
}

router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const [tickets] = await db.query('SELECT * FROM tickets ORDER BY created_at DESC');
        const totalTickets = tickets.length;
        const submittedCount = tickets.filter(t => t.status === 'Submitted').length;
        const progressCount = tickets.filter(t => ['Under Review', 'In Progress'].includes(t.status)).length;
        const resolvedCount = tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length;

        res.render('admin/dashboard', {
            tickets,
            totalTickets,
            submittedCount,
            progressCount,
            resolvedCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while loading admin dashboard.');
    }
});

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