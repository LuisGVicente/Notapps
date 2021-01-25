const mongoose = require('mongoose');//1. Instanciamos el módulo de mongoose que nos permitirá conectarnos a una colección de MongoDB
//2. Conectamos mongoose a la tabla de Mongo. Aquí, usamos Mongo local, así que mongodb estará conectado (:) a localhost/colección. Si la colección no está creada (notes-db-app), la crea. Aparte, como segundo parámetro, hay que pasarle un objeto para configurarlo por defecto
//ACTUALIZACIóN: para conectarla a Mongo Atlas, tenemos que ir a nuestro cluster, darle 'connect' > 'connect your application' y copiamos el código en una variable que vamos a pasar a mongoose
const MONGODB_URI = 'mongodb+srv://lgvicente:Mongodb2021@cluster0.e2kg7.mongodb.net/Notapps?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log('DB is connected to', db.connection.host))
.catch(err => console.log(err));
//3. Para arrancar mongoose, tenemos que inicianizarlo en src/index.js poniendo require('./database')