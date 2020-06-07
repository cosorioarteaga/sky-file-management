const express = require('express');
const router = express.Router();

// Models
  //const Note = require('../models/Empresa');
  const Empresa = require('../models/Empresa');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


// Nueva empresa
router.get('/empresa/add', isAuthenticated, (req, res) => {
  res.render('empresa/nueva-empresa');
});



router.post('/empresa/crear',isAuthenticated,  async (req, res) => {
  const { title, description, identificacion,numcolenvia,numcolrecibe,columna_debito } = req.body;
  const errors = [];
  if (!identificacion) {
    errors.push({text: 'Por favor ingrese ingrese la identificación RUC.'});
  }
  if (!title) {
    errors.push({text: 'Por favor ingrese el título.'});
  }
  if (!description) {
    errors.push({text: 'Por Por favor ingrese la descripción.'});
  }
  if (errors.length > 0) {
    res.render('empresa/nueva-empresa', {
      errors,
      title,
      description,
      identificacion
    });
  } else {
    const nuevaEmpresa = new Empresa({title, description, identificacion,numcolenvia,numcolrecibe,columna_debito });
    //nuevaEmpresa.user = req.user.id;

    console.log('NUEVA EMPRESA ' + nuevaEmpresa);
    await nuevaEmpresa.save();
    req.flash('success_msg', 'Empresa agregada correctamente');
    res.redirect('/empresas');
    //res.send('Bienvenido ' + nuevaEmpresa)
  }
});


//LISTAR TODAS LAS EMPRESAS
router.get('/empresas', isAuthenticated, async (req, res) => {
  //res.send(' empresas a la bdd');
  const empresa = await Empresa.find();
  res.render('empresa/todas-empresa',{ empresa });
});

//ELIMINAR EMPRESA
router.delete('/empresas/eliminar/:id', isAuthenticated, async (req, res) => {
  await Empresa.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Empresa eliminada correctamente.');
  res.redirect('/empresas');
});

//EDITAR EMPRESA

router.get('/empresa/edit/:id', isAuthenticated, async (req, res) => {
  const empresa = await Empresa.findById(req.params.id);
  /*if(note.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  } */
  req.flash('success_msg', 'Empresa editada correctamente.');
  res.render('empresa/edita-empresa', { empresa });
});


//GUARDANDO LOS DATOS EDITADOS DE LA EMPRESA isAuthenticated
router.put('/empresa/editada/:id', isAuthenticated, async (req, res) => {
  const { title, description,identificacion,numcolenvia,numcolrecibe,columna_debito } = req.body;
  await Empresa.findByIdAndUpdate(req.params.id, {title, description,identificacion,numcolenvia,numcolrecibe,columna_debito});
  req.flash('success_msg', 'Empresa actualizada con éxito');
  res.redirect('/empresas');
});

module.exports = router;