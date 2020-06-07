const express     = require('express');
const router      = express.Router();

const fileUpload  = require('express-fileupload');

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Empresa     = require('../models/Empresa');
const Ramo        = require('../models/Ramo');
const Servicio    = require('../models/Servicio');
const Carga       = require('../models/Carga');
const Archivo     = require('../models/Archivo');


const fs          = require('fs');

const CargaDetalle = require('../models/CargaDetalle');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

//const mongoose = require('mongoose').MongoClient;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost";


var dbo = '';
var var_cantidad_registros = 0;
var regcant = 0;
var tot_reg;

var path_file = 'src/public/upload/';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   dbo = db.db("gestion-archivos-db");
  dbo.createCollection("carga_detalle", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    //db.close();
  });
});

// default options
router.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 },
}));


//add other middleware
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(morgan('dev'));



//PRIMER PASO INGREANDO  INSTITUCION FINANCIERA SERIVICIO Y RAMO
router.get('/archivo/cargar',isAuthenticated, async  (req, res) => {

  const empresa   = await Empresa.find();
  const ramo      = await Ramo.find();
  const servicio  = await Servicio.find();

  res.render('archivo/subir',{ empresa , ramo , servicio }   );

  });


            // VALIDANDO Y GUARDANDO LA INFORMACION DEL PRIMER PASO

            router.post('/archivo/crear_carga', isAuthenticated , async (req, res) => {

                      const { idempresa, idservicio , idramo } = req.body;
                      const rutafile          = '';
                      const nombrefile        = '';
                      const estado            = 0;
                      const cantidadregistros = 0;
                      const errors = [];

                      if (!idempresa) { errors.push({text: 'Por favor seleccione la empresa.'}); }
                      if (!idservicio) { errors.push({text: 'Por favor seleccionete el servicio.'}); }
                      if (!idramo) { errors.push({text: 'Por favor seleccione el ramo.'}); }

                          if (errors.length > 0) { 
                              res.render('archivo/cargar', { errors,idempresa,idservicio,idramo });
                          } else {
                                  const nuevaCarga = new Carga({ idempresa, idservicio , idramo , rutafile , nombrefile , estado , cantidadregistros });
                                  await nuevaCarga.save();
                                  res.redirect('/archivo/cargado/:'+nuevaCarga._id);
                          }
            });


//PASANDO LA INFORMACION INGRESADA EN EL PRIMER PASO AL SEGUNDO PASO QUE ES LA CARGA DEL NUEVO ARCHIVO DE CARGA
router.get('/archivo/cargado/:_id', isAuthenticated , async (req, res) => {
 
  var myId = req.params._id.replace(":", "");

  const carga     = await Carga.findOne({'_id':myId});
  const empresa   = await Empresa.findOne({'_id':carga.idempresa});
  const ramo      = await Ramo.findOne({'ram_cod':carga.idramo});
  const servicio  = await Servicio.findOne({'ser_cod':carga.idservicio});

  res.render('archivo/carga-creada',{ carga ,empresa , ramo, servicio} );

});


router.post('/archivo/upload/:_id', isAuthenticated,async(req, res)=> {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let archivotxt = req.files.archivotxt;
          
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          
          archivotxt.mv(path_file + archivotxt.name);

          //send response
          //console.log(req.files.archivotxt);
          //console.log('RUTA DEL ARCHIVO: ./src/public/upload/' + archivotxt.name);

          const name = req.files.archivotxt.name;
          const size = req.files.archivotxt.size;
          const mimetype = req.files.archivotxt.mimetype;
          const md5 = req.files.archivotxt.md5;
          const file_path = './src/public/upload/'+archivotxt.name;
          const estado = 0;
          const cantidad = 0;
          
          const archivo = new Archivo({name,size,mimetype,md5,file_path,cantidad,estado});
          await archivo.save();
          
          res.redirect('/archivo/subido');

      }
  } catch (err) {
      res.status(500).send(err);
  }
});





//LISTANDO LOS ARCHIVOS CARGADOS
router.get('/archivo/subido', isAuthenticated , async  (req, res) => {

 /* const carga = await Carga.find();
  res.render('archivo/listaarchivossubidos',{ carga }   );*/

  const archivo = await Archivo.find({estado:0});
  res.render('archivo/archivo_cargado',{ archivo }   );

    });


//VAMOS A REGISTRAR LA CARGA REALIZADA VAMO A IN SERTAR LOS DATOS Y ACTUALIZAR EL ESTADO Y LA CANTIDAD DE REGISTRPS

router.post('/archivo/registrar/:_id',isAuthenticated , async  (req, res) => {

  
  const archivo_cargado = await Archivo.findById(req.params._id);
  
  const file_path = archivo_cargado.file_path;
  const name = archivo_cargado.name;
  

              fs.readFile(file_path,"utf8", function(err, data)
              {
                        var rows = data.split("\n");
                        var json = [];
                        var keys = [];

                  rows.forEach((value, index)=>{
                    
                      if ( value.length > 0) 
                      {
                        regcant++;
                                  if (index<1)
                                  {
                                      value = value.replace('\r', '')
                                      value = value+',idtransaccion\r';}
                                  else{
                                      value = value.replace('\r', '')
                                      value = value+','+req.params._id+'\r';}

                                  if(index < 1){// get the keys from the first row in the tab space file
                                      keys = value.split(",");
                                  }else {// put the values from the following rows into object literals
                                      values = value.split(",");
                                  
                                          json[index-1] = values.map((value, index) => {
                                              return {
                                                  [keys[index]]: value
                                              }
                                          }).reduce((currentValue, previousValue) => {
                                              return {
                                                  ...currentValue,
                                                  ...previousValue
                                              }
                                          });
                                      }
                      }
                  })

                  const estado_registrado = 1;
                  const totalreg = regcant - 1;
                 Archivo.findByIdAndUpdate(req.params._id,
                  { cantidad:totalreg, estado:estado_registrado  },
                  
                  function(err, result) {
                    if (err) {
                      console.log(" =========== err "+err);
                      res.send(err);
                    } else {
                      console.log(" ========== result "+result);
                      //res.send(result);
                      //next();
                    }
                  }
                );

                  // convert array of objects into json str, and then write it back out to a file
                  let jsonStr     = JSON.stringify(json);
                  const file_path_json = file_path.replace('.txt', '')

                  fs.writeFileSync(file_path_json+'.json', jsonStr, {encoding: "utf8"})

                  var obj = JSON.parse(fs.readFileSync(file_path_json+'.json', 'utf8'));
        
                  //console.log("obj "+obj)
                  var v_collection = 'carga_detalle';
                  dbo.collection(v_collection).insertMany(obj, function(err, res) {
                      if (err) throw err;
                         // db.close();
                                   
                    }); //insertMany

                }); //readFile
               
                //res.render('archivo/cargado_correctamente');

              //res.redirect('/archivo/subido');
             /* console.log(" REDIRECCIONANDO ============================== ");
              const totalreg_ = 0;*/
          //   res.redirect('/archivo/registrado'); 

          req.session.valid = true;

           const archivo = await Archivo.find({estado:1});
         res.render('archivo/archivo_registrado',{ archivo }   );

     });



//LISTANDO LOS ARCHIVOS CARGADOS
router.get('/archivo/registrado', isAuthenticated , async  (req, res) => {

  console.log(" REDIRECCIONANDO DENTRO   ============================== ");


  /* const carga = await Carga.find();
   res.render('archivo/listaarchivossubidos',{ carga }   );*/
 
   const archivo = await Archivo.find({estado:1});
   //res.render('archivo/cargado_correctamente',{ archivo }   );
   res.render('archivo/archivo_registrado',{ archivo }   );
 
     });


module.exports = router;




/*
router.post('/archivo/actualiza_cant_registro', async  (req, res) => {
  
  const { iduniqcarga, tot_reg} = req.body;

  await Carga.findByIdAndUpdate(iduniqcarga, {cantidadregistros:tot_reg});

    const empresa = await Empresa.find();
    const ramo = await Ramo.find();
    const servicio = await Servicio.find();
    
    res.redirect('archivo/subido');

  });

*/