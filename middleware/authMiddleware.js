function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }

    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
}

function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    res.status(403).render('auth/login', {
        error: 'Access Denied: Administrator privileges required.',
        successMessage: null
    });
}

module.exports = { isAuthenticated, isAdmin };