const passport = require('passport');//1. Instanciamos el módulo externo passport que nos permite autenticar al user
const LocalStrategy = require('passport-local').Strategy;//2. Instanciamos el módulo passport-local para autenticaciones locales
const User = require('../models/User');//3. Para las autenticaciones siempre vamos a necesitar del modelo que gestiona a los usuarios

//4. Configuramos la autenticación local. Para ello, le pasamos a passport el objeto LocalStrategy
passport.use(new LocalStrategy({
    //5. La prop usernameField determina qué propiedad de la clase User se usará para autenticar y lo hará con la función que le sigue que tendrá como parámetros los campos que haya introducido el usuario para loguearse y el callback 'done'.
    usernameField: 'email'
}, async (email, password, done) => {
    //6. Buscamos si en la BBDD existe un usuario con un det email
    const user = await User.findOne({email: email});
    if (!user) {
        //7. Si el user no existe, devolvemos el callback por defecto 'done'. Sus parámetros son: null (no sé por qué) y la respuesta. Si la respuesta es false, tiene un tercer parámetro que es el mensaje de error. 
        return done(null, false, {message: 'User not found'});
    } else {
        //8. Usamos el método que creamos el User para comprobar que la password coincide. Sí? done devuelve al usuario. No? devuelve un error
        const match = await user.matchPassword(password);
        match ?  done (null, user) : done(null, false, {message: 'Incorrect Password'});  
    }
}));

//9. Una vez el user se ha autenticado, tenemos que mantener su sesión abierta. Para ello, usamos el método .serializeUser y deserializeUser que permite que el usuario se mueva entre distintos dominios.
passport.serializeUser((user, done)=>{
    done(null, user.id);
});
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) =>{
        done(err,user);
    });
});

