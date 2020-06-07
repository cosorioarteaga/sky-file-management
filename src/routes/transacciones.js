const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
// Models
  const Carga = require('../models/Carga');
  const Usuario = require('../models/Usuario');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

//handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));


//LISTAR TODAS LAS TRANSACCIONES CARGARDAS
router.get('/transaccion/cargada', isAuthenticated, async (req, res) => {
    //res.send(' empresas a la bdd');
    // nuevaEmpresa.user = req.user.id;
    //console.log('req.user.id: ' + req.user.id);
   
    var usuario = await Usuario.findById(req.user.id);
    const { idempresa_fk, name, email, password,rol , date } = usuario;
    const carga = await Carga.find({idempresa:idempresa_fk});
    res.render('transacciones/cargadas',{ carga });
  });

  module.exports = router;