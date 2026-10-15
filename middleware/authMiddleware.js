// Check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

// Check if user is an Admin
function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied: Administrator privileges required. Please <a href="/auth/login">log in as admin</a>.');
}

module.exports = { isAuthenticated, isAdmin };