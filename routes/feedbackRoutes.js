const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/uploadMiddleware'); // Import upload middleware

// ==================== 1. FEEDBACK SUBMISSION ROUTES ====================

// GET /feedback/new - Show the feedback submission form
router.get('/new', (req, res) => {
    res.render('feedback/new-ticket'); // Renders views/feedback/new-ticket.ejs
});

// POST /feedback/new - Handle form submission with file upload support
router.post('/new', upload.single('attachment'), async (req, res) => {
    try {
        const { category, title, location, description, is_anonymous } = req.body;
        
        // Generate a unique tracking code (e.g., TCK-XXXXXX)
        const trackingCode = 'TCK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Determine if anonymous
        const anonymousFlag = is_anonymous === 'on' ? 1 : 0;
        
        // Get file path if an attachment was uploaded (up to 10MB)
        const attachmentPath = req.file ? '/uploads/' + req.file.filename : null;
        
        // Insert into database including attachment_path
        await db.query(
            `INSERT INTO tickets (category, title, location, description, is_anonymous, tracking_code, attachment_path, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
            [category, title, location, description, anonymousFlag, trackingCode, attachmentPath]
        );

        res.send(`<h1>Success!</h1><p>Your feedback has been submitted.</p><p>Your tracking code is: <strong>${trackingCode}</strong></p><a href="/feedback/new">Submit another</a> | <a href="/feedback/track">Track a ticket</a>`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while submitting feedback.');
    }
});


// ==================== 2. TICKET TRACKING ROUTES ====================

// GET /feedback/track - Show the tracking search page
router.get('/track', (req, res) => {
    res.render('feedback/track-status', { ticket: null, error: null });
});

// POST /feedback/track - Search for the ticket by tracking code
router.post('/track', async (req, res) => {
    try {
        const { tracking_code } = req.body;
        
        // Query database for the ticket
        const [rows] = await db.query(
            'SELECT * FROM tickets WHERE tracking_code = ?',
            [tracking_code.trim().toUpperCase()]
        );

        if (rows.length === 0) {
            // If code doesn't exist
            return res.render('feedback/track-status', { 
                ticket: null, 
                error: 'Ticket code not found. Please verify and try again.' 
            });
        }

        // Render the tracking page with ticket details
        res.render('feedback/track-status', { ticket: rows[0], error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while tracking ticket.');
    }
});

// GET /feedback/details/:id - View single ticket details
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