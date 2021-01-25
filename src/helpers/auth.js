//1. Vamos a crear un objeto llamado helpers que tendrá distintos métodos:
const helpers = {};

//3. Creamos un método para saberr si un usuario está autenticado. Para ello vamos a usar Passport
helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Not Authorized. Please, sigin to continue');
    res.redirect('/users/signin');
}


module.exports = helpers;//2. Lo exportamos