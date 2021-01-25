const express = require('express');
const router = express.Router();
const User = require('../models/User');//6. Instanciamos el modelo de User
const passport = require('passport');//10. Instanciamos Passport

//1.Las rutas que no estén en routes/index.js suelen llevar /name/otroname
router.get('/users/signin', (req, res) => {
    //2. En la ruta dada ('/users/signin'), se renderizará el archivo hbs de 'users/signin'
    res.render('users/signin');
});
//11.Passport autenticará el form de esta ruta. Para ello usamos el método authenticate de passport y le indicamos qué estrategia estamos usando ('local' en este caso). Luego le indicamos a dónde ir si todo va bien y a dónde si no.
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});
//3. Creamos una ruta para hacer post al servidor con los datos del usuario que se está registrando
router.post('/users/signup', async (req, res) =>{
    //4. Creamos una variable con el mismo nombre que los campos del form
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    //5. Validaciones (son muy simples, la mejor práctica es usar el módulo express validator)
    if (name.length <= 0 || email.length <= 0 || password.length <= 0 || confirm_password.length <= 0) {
        errors.push({text: 'Please, fill up all fields'});
    } 
    if(password != confirm_password) {
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirm_password})
    }
    else {
        //7. Como vamos a mandar a la BBDD un nuevo usuario, necesitamos la plantilla User. Pero primero tenemos que confirmar que ese nuevo usuario no está ya registrado
        const emailUser = await User.findOne({email: email})
        if (emailUser) {
            req.flash('error_msg', 'This mail is already in use');
            res.redirect('/users/signup');
        } else {
            //8. Creamos una nueva plantilla con las propiedades que le vamos a pasar y usamos el método save para guardarlo en la base de datos
            const  newUser = new User({name, email, password});
            //9. Para poder mandar la password encriptada tenemos que hacer uso del método que creamos en User.js punto 5
            newUser.password =  await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
        }

    }
})
//12. Ruta para cerrar sesión
router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');

})

module.exports = router;