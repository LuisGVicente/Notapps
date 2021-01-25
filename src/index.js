const express = require('express');//1. Instanciamos el módulo express
const path = require('path'); //4.Instanciamos el módulo built-in path para definir rutas
const exphbs = require('express-handlebars');//6A. Instanciamos el motor de plantillas. No se usa si hacemos el front con otra tecnología
const methodOverride = require('method-override');//8. Módulo para poder darle más métodos a los formularios, no sólo get y post
const session = require('express-session');//9. Módulo para trabajar con sesiones de usuario
const flash = require('connect-flash');//13. Instanciamos el módulo para mensajes Flash
const passport = require('passport')//16. Instaciamos el módulo externo passport para validaciones de usuarios

//I. inicializaciones________________________________________________________________________________________________________________________

const app = express();//2.Instanciamos el módulo express ejecutado
require('./database');//13. Inicializamos el archivo local de base de datos que hemos configurado en database.js. Si funciona, deberíamos ver en terminal un mensaje que dice "DB is connected"
require('./config/passport');//18. inicializamos la configuración de passport

//II. Aquí definimos la CONFIGURACIÓN ppal___________________________________________________________________________________________________

//3.Configura qué puerto usa el programa. Los servicios en la nube tienen su propio puerto, que indicamos con 'process.env.PORT'. Si no lo hubiese, usar el 3000
app.set('port', process.env.PORT || 3000); 
//5. Configura las vistas('views' en este caso). Pero tenemos que vincular index.js con la carpeta donde están las vistas. Para eso usamos el objeto __dirname, que devuelve en qué carpeta nos encontramos. Aquí devolverá "src". El método path.join une la carpeta actual + un string con el nombre de la carpeta que queramos (aquí "src/","view")
app.set('views', path.join(__dirname,'views'))
//6B: indicamos cuál será el motor de plantillas
app.engine('.hbs', exphbs({
    //6C: cuál es el archivo principal
    defaultLayout: 'main',
    //6D: dónde está el archivo ppal
    layoutsDir: path.join(app.get('views'), 'layouts'),
    //6E: dónde están los partials
    partialsDir:  path.join(app.get('views'), 'partials'),
    //6F: cuál es la extensión de las plantillas. A partir de ahora no necesitamos indicar que los archivos son .hbs. No hace falta
    extname: '.hbs'
}));
app.set('view engine','.hbs');

//III. MIDDLEWARES (funciones que se ejecutan (a)antes de mandar info al servidor o (b)antes de que el servidor mande datos a las rutas)_____

//7. Middleware que sirve para leer los datos de la url
app.use(express.urlencoded({extended: false}))
//9. Le damos a express la posibilidad de que sus formularios usen todos los métodos posibles
app.use(methodOverride('_method'));
//10.Conf por defecto
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}))
//17.(NOTA: el middleware de passport tiene que ir siempre detrás de session (punto 10)). Configuramos passport
app.use(passport.initialize());
app.use(passport.session());
//14.Permitimos el uso de mensajes flash (NOTA: debe ir siempre debajo de session (pt 10) y passport (pto 17))
app.use(flash());

//IV. Variables GLOBALES (datos accesibles desde toda la aplicación)________________________________________________________________________

//15.Como queremos que todas las vistas tengan acceso a los mensajes flash, tenemos que crear una variable global
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    //19. Passport tiene su propio error llamado 'error', así que tenemos que incluirlo aquí y el partials/errors.hbs
    res.locals.error = req.flash('error');
    //20. Nos permite crear un saludo de bienvenida al usuario
    res.locals.user = req.user || null;
    next();
})

//V. Routes__________________________________________________________________________________________________________________________________

//11. Indicamos a express dónde estamos configurando las rutas de nuestra app
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//VI. Static files___________________________________________________________________________________________________________________________

//12. Dado que meteremos todos nuestros archivos estáticos en la carpeta "public", tenemos que indicar a express dónde encontrarlos
app.use(express.static(path.join(__dirname,'/public')));

//VII. Server is listening___________________________________________________________________________________________________________________
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});