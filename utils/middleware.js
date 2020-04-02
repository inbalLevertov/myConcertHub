exports.requireLoggedOutUser = function(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        next();
    }
};

exports.requireLoggedInUser = function(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        next();
    }
};
