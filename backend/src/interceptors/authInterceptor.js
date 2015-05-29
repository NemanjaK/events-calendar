
module.exports = function (req, res, next) {
    if ((req.user && req.user.user_account) || req.url == '/services/loginStatus' || req.url == '/login' || req.url == '/logout') {
        next();
    } else {
        console.log('Not Authorized to access [' +  req.url + ']');
        res.status(403).send('Not Authorized to access [' +  req.url + ']');
    }
};