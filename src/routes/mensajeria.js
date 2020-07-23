const express = require('express');
const router = express.Router();
//onst router = require('request');
const request = require("request-promise")


const RUTA = "http://200.115.38.169/Mensajeria/api/hojaruta/0202136784";


// Helpers
const { isAuthenticated } = require('../helpers/auth');


// Consumir ws para traer todas las tareas
router.get('/mensajeria/lista', isAuthenticated, (req, res) => {
   
    request({
        uri: RUTA,
        json: true, // Para que lo decodifique automáticamente 
    }).then(hojaruta => {

        res.render('mensajeria/lista_entrega',{ hojaruta });

        /*hojaruta.forEach(hoja_ruta => {
            console.log(`Tenemos a un usuario llamado ${hoja_ruta.nombrecliente} con correo ${hoja_ruta.apellidocliente}`);
        })*/


    });


  });
  

 


 router.post('/mensajeria/registrar',isAuthenticated,  async (req, res) => {
    
    
    const {ced, estadovuelta, observacionvuelta,idrecepciondocumento,idregistro } = req.body;

    var myJSONObject = {   identificacion: ced,
                            estadovuelta: estadovuelta,
                            observacionvuelta: observacionvuelta,
                            idrecepciondocumento: idrecepciondocumento,
                            idregistro:idregistro
                      };
    
    console.log('json',myJSONObject);

      request({
          url: "http://200.115.38.169/Mensajeria/api/hojaruta",
          method: "POST",
          json: true,   // <--Very important!!!
          body: myJSONObject
      }, function (error, response, body){
          console.log(response);
          res.redirect('/mensajeria/lista');
      });

   });
 



module.exports = router;