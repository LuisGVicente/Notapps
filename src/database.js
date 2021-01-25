const mongoose = require('mongoose');//1. Instanciamos el módulo de mongoose que nos permitirá conectarnos a una colección de MongoDB
//2. Conectamos mongoose a la tabla de Mongo. Aquí, usamos Mongo local, así que mongodb estará conectado (:) a localhost/colección. Si la colección no está creada (notes-db-app), la crea. Aparte, como segundo parámetro, hay que pasarle un objeto para configurarlo por defecto
mongoose.connect('mongodb://localhost/notes-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));
//3. Para arrancar mongoose, tenemos que inicianizarlo en src/index.js poniendo require('./database')