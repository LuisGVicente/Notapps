const express = require('express');//1. Instanciamos el módulo de Express
const router = express.Router();//2. Instanciamos todos los métodos de routing de Express

//4. El método .get nos permite vincular una ruta y una vista
router.get('/', (req, res) => {
    //5. Indicamos que una ruta ('/') renderizará una vista det. ('index.hbs')
    res.render('index')
})

router.get('/about', (req, res) => {
    res.render('about');
})

module.exports = router;//3. Exportamos router para poder usarlo en otros archivos