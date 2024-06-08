exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}
exports.isStudent = (req, res, next) => {
    if (!(req.session.user.user_type == "Student")) {
        return res.redirect('/404');
    }
    next();
}
exports.isAdmin = (req, res, next) => {
    if (req.session.user.user_type == "Admin") {
        return res.redirect('/404');
    }
    next();
}
exports.isEmployee = (req, res, next) => {
    if (req.session.user.user_type == "Employee") {
        return res.redirect('/404');
    }
    next();
}
