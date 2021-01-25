const mongoose = require('mongoose');//1. Instanciamos mongoose
const {Schema} = mongoose;//2. Instanciamos el objeto de Mongoose que nos permite crear plantillas de bases de datos, Schema
const bcrypt = require('bcryptjs');//6. Instanciamos el módulo externo para encriptar contraseñas

//3.Creamos una plantilla para las notas indicando qué campos tendrá, qué tipo de dato serán, si es un campo obligatorio(required) o si va a tener un valor por defecto en el caso de que no se introduzcan datos(default)
const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    //Date aquí no es necesario pero aún así lo usaremos
    date: {type: Date, default: Date.now}
})

//5. Podemos crear métodos para los Schema a través de .methods.nombreQueLeDemosAlMetodo. Aquí, creamos un método para encriptar contraseñas.
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};
//7. Aquí creamos otro método para poder comparar contraseñas cifradas que nos permitirá que los usuarios se logueen. En este caso no podemos usar una función flecha debido al scope. Usando una función normal, tendremos acceso a las propiedades de UserSchema (es decir, podremos usar this.password). Lo necesitamos para poder comparar contraseñas
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//4. Para poder usar la plantilla tenemos que exportar el método .model de mongoose, pasándole dos parámetros: un nombre para ese esquema y la variable donde está guardada
module.exports = mongoose.model('User', UserSchema);