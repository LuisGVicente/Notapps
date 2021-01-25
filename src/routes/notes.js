const express = require('express');
const router = express.Router();
const Note = require('../models/Note');//4. Importamos el archivo de plantillas de la BBDD. Ahora puedo mandar o recibir info de la BBDD con los datos organzados
const {isAuthenticated} = require('../helpers/auth');//18. Nos traemos los métodos que necesitamos de helpers para poder asegurarnos que las rutas autentican al usuario. Le añadimos el método isAuthenticated de helpers antes de la req y res a todas las rutas que lo necesiten: va a validar si el user está logueado; si lo está, continua; si no lo está, lo manda a la pantalla de signin

//1. Creamos una ruta para CREAR nuevas notas y la vinculamos a una vista con un formulario
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note')
})

//2.Creamos una ruta para poder recibir los datos del formulario de new-note.hbs. Como habrá procesos asíncronos (guardar la nota en la BBDD), le ponemos el async
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    //3. Podemos hacer que las propiedades de un objeto (req.body en este caso) se conviertan en variables de la siguiente manera:
    const {title, description} = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: 'Please, write a title'})
    }
    if (!description) {
        errors.push({text: 'Please, write a description'})
    }
    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    } else {
        //5. Instanciamos la clase Note, indicando en un objeto los campos que queremos de esa clase. No se añade id porque Mongo lo crea por defecto
        
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        //6. Para poder guardarla en la BBDD tenemos que usar el método save. Es el método asíncrono que anunciamos en el punto 2, así que hay que ponerle await
        await newNote.save();
        //15. Mensaje flash notificando que se ha añadido una nota nueva
        req.flash('success_msg','Note added succesfully');
        //7. Una vez mandado el form, redireccionamos a donde convenga
        res.redirect('/notes');
    }
    
});


router.get('/notes', isAuthenticated, async (req, res) => {
    //8. MOSTRAR NOTAS DE LA BBDD: En models/Note.js habíamos exportado la clase Note, que gestiona la colección notes de nuestra BBDD. Ahora podemos usarla para buscar info en ella. Trabajar con BBDD siempre es asíncrono, así que debemos usar async/await.
    await Note.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                title: documento.title,
                description: documento.description,
                _id: documento._id,
                date:documento.date
            }
          })
        }
        //9. Ahora podemos renderizar la página que deseemos y pasarle un objeto con el resultado de la consulta
        res.render('notes/all-notes', {
 notes: contexto.notes }) 
      })
  })

//10. UPDATE: creamos una ruta propia para cada nota. Esa ruta contendrá un form que reciba los datos de esa nota para poder modificarlos
router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    //11.Buscar en notes por id: el id buscado es aquel que aparece en la ruta
    const note = await Note.findById(req.params.id).lean()
    res.render('notes/edit-note', {note})
})
//12. Una vez hemos encontrado la nota que queremos actualizar, tenemos que modificarla y mandar los cambios al servidor. Se suele usar PUT si se está actualizando un dato existente en la BBDD y POST si se está creando uno nuevo.
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) =>{
    const {title, description} = req.body;
    //13. Busca en la colección Note un registro por si ID y actualiza su title y description. Después muestra todas las notas
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    //16. Mensaje flash notificando que se ha modificado una nota 
    req.flash('success_msg', 'Note updated successfully');
    res.redirect('/notes');
})
//14. DELETE: un botón delete mandará a esta dirección el id que queremos borrar (req.params.id). La clase Note buscará ese id y lo borrará
router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    //17. Mensaje flash notificando que se ha eliminado una nota 
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
})

module.exports = router;