const mongoose = require('mongoose');//1. Instanciamos mongoose
const {Schema} = mongoose;//2. Instanciamos el objeto de Mongoose que nos permite crear plantillas de bases de datos, Schema

//3.Creamos una plantilla para las notas indicando qué campos tendrá, qué tipo de dato serán, si es un campo obligatorio(required) o si va a tener un valor por defecto en el caso de que no se introduzcan datos(default)
const NoteSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String}
})
//4. Para poder usar la plantilla tenemos que exportar el método .model de mongoose, pasándole dos parámetros: un nombre para ese esquema y la variable donde está guardada
module.exports = mongoose.model('Note', NoteSchema);