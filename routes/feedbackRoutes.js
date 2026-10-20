const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/uploadMiddleware');

const validCategories = ['Campus Facilities', 'Academic Services', 'Cafeteria & Health', 'Accessibility & Safety', 'Other'];

function requireAuthentication(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
}

router.get('/new', requireAuthentication, (req, res) => {
    res.render('feedback/new-ticket', {
        error: null,
        formData: null,
        successMessage: null
    });
});

router.post('/new', requireAuthentication, upload.single('attachment'), async (req, res) => {
    try {
        const category = (req.body.category || '').trim();
        const title = (req.body.title || '').trim();
        const location = (req.body.location || '').trim();
        const description = (req.body.description || '').trim();
        const isAnonymous = req.body.is_anonymous === 'on' ? 1 : 0;
        const userId = req.session.user.id;

        if (!validCategories.includes(category)) {
            return res.status(400).render('feedback/new-ticket', {
                error: 'Please select a valid feedback category.',
                formData: req.body,
                successMessage: null
            });
        }

        if (!title || title.length < 5 || !location || !description || description.length < 10) {
            return res.status(400).render('feedback/new-ticket', {
                error: 'Title, location, and description are required. Please provide useful details.',
                formData: req.body,
                successMessage: null
            });
        }

        const trackingCode = 'TCK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const attachmentPath = req.file ? '/uploads/' + req.file.filename : null;

        await db.query(
            `INSERT INTO tickets (user_id, category, title, location, description, is_anonymous, tracking_code, attachment_path, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
            [userId, category, title, location, description, isAnonymous, trackingCode, attachmentPath]
        );

        return res.redirect(`/feedback/mine?submitted=${encodeURIComponent(trackingCode)}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while submitting feedback.');
    }
});

router.get('/track', (req, res) => {
    res.render('feedback/track-status', { ticket: null, error: null });
});

router.get('/mine', async (req, res) => {
    if (!req.session || !req.session.user) {
        req.session.returnTo = '/feedback/mine';
        return res.redirect('/auth/login');
    }

    try {
        const [tickets] = await db.query(
            'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );
        const submittedCode = typeof req.query.submitted === 'string'
            && /^TCK-[A-Z0-9]{6}$/.test(req.query.submitted)
            ? req.query.submitted
            : null;
        return res.render('feedback/my-feedback', { tickets, submittedCode });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error while loading your feedback.');
    }
});

router.get('/faq', (req, res) => {
    res.render('feedback/faq');
});

router.post('/track', async (req, res) => {
    try {
        const trackingCode = (req.body.tracking_code || '').trim().toUpperCase();

        if (!trackingCode) {
            return res.render('feedback/track-status', {
                ticket: null,
                error: 'Please enter a tracking code.'
            });
        }

        const [rows] = await db.query('SELECT * FROM tickets WHERE tracking_code = ?', [trackingCode]);

        if (rows.length === 0) {
            return res.render('feedback/track-status', {
                ticket: null,
                error: 'Ticket code not found. Please verify and try again.'
            });
        }

        res.render('feedback/track-status', { ticket: rows[0], error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while tracking ticket.');
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send('Ticket not found.');
        }
        res.render('feedback/details', { ticket: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error retrieving ticket details.');
    }
});

module.exports = router;