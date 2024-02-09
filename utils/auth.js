const authInput = (req, res, next) => {
    //redirect
    if(!req.session.logged_in) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = authInput;