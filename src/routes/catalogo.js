const express = require('express');
const router = express.Router();

// Models
const Ramo = require('../models/Ramo');
const Servicio = require('../models/Servicio');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// Nueva ramo
router.get('/catalogo/addramo', isAuthenticated,  (req, res) => {
  res.render('catalogo/nuevo-ramo');
});



router.post('/catalogo/crear_ramo', isAuthenticated, async (req, res) => {
  const { ram_cod, ram_descripcion } = req.body;
  const errors = [];
  if (!ram_cod) {
    errors.push({text: 'Por favor ingrese el código del ramo.'});
  }
  if (!ram_descripcion) {
    errors.push({text: 'Por favor ingrese la descripción del ramo.'});
  }
  
  if (errors.length > 0) {
    res.render('catalogo/nuevo-ramo', {
      errors,
      ram_cod,
      ram_descripcion
    });
  } else {
    const nuevoRamo = new Ramo({ ram_cod, ram_descripcion });
    //nuevaEmpresa.user = req.user.id;
    //console.log('NUEVO RAMO ' + nuevoRamo);
    await nuevoRamo.save();
    
    res.redirect('/catalogo/addramo');
    
  }
});


//LISTAR TODAS LOS RAMOS
router.get('/catalogo/listaderamos', isAuthenticated, async (req, res) => {
  //res.send(' empresas a la bdd');
  const ramo = await Ramo.find();
  res.render('catalogo/view_listaderamos',{ ramo });
});



// Nuevo servicio
router.get('/catalogo/addservicio', isAuthenticated, (req, res) => {
  res.render('catalogo/nuevo-servicio');
});



router.post('/catalogo/crear_servicio', isAuthenticated, async (req, res) => {
  const { ser_cod, ser_descripcion } = req.body;
  const errors = [];
  if (!ser_cod) {
    errors.push({text: 'Por favor ingrese el código del servicio.'});
  }
  if (!ser_descripcion) {
    errors.push({text: 'Por favor ingrese la descripción del servicio.'});
  }
  
  if (errors.length > 0) {
    res.render('catalogo/nuevo-servicio', {
      errors,
      ser_cod,
      ser_descripcion
    });
  } else {
    const nuevoServicio = new Servicio({ ser_cod, ser_descripcion });
    //nuevaEmpresa.user = req.user.id;
    console.log('NUEVO SERVICIO ' + nuevoServicio);
    await nuevoServicio.save();
    
    res.redirect('/catalogo/addservicio');
    
  }
});

//LISTAR TODAS LOS SERVICIOS
router.get('/catalogo/listadeservicios', isAuthenticated, async (req, res) => {
  //res.send(' empresas a la bdd');
  const servicio = await Servicio.find();
  res.render('catalogo/view_listadeservicios',{ servicio });
});

module.exports = router;