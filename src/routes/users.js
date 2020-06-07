  
const router = require('express').Router();
const passport = require('passport');

// Models
const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');
const Carga = require('../models/Carga');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


router.get('/users/signup/:id', isAuthenticated, (req, res) => {
  const idempresa_fk = req.params.id

 // console.log(' requestID ' + idempresa_fk);
  res.render('users/signup',{idempresa_fk});
});

  
router.get('/users/login', (req, res) => {
  res.render('users/login');
});


//CODIGO ORIGINAL
router.post('/users/login', passport.authenticate('local', {
  
  successRedirect: '/empresasyusuario',
  failureRedirect: '/users/login',
  failureFlash: true
}));



router.get('/users/logout', isAuthenticated,  (req, res) => {
  req.logout();
  req.flash('success_msg', 'La cesión se ha cerrado.');
  res.redirect('/users/login');
});


router.post('/users/signup/', isAuthenticated, async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password,idempresa_fk , rol } = req.body;
  //console.log(' idEmpresa ===== ' + idempresa_fk);



if (name-this.length <=0)
{
  errors.push({text: 'El usuario es campo requerido.'});
  //res.render('users/signup',{idEmpresa});
}

  if(password != confirm_password) {
    errors.push({text: 'Las claves son diferentes.'});
   // res.render('users/signup',{idEmpresa});
  }
  if(password.length < 7) {
    errors.push({text: 'La clave debe tenar mas de 7 caracteres .'})
  //  res.render('users/signup',{idEmpresa});
  }
  if(errors.length > 0){
    res.render('users/signup', {errors, name, email, password, confirm_password, idempresa_fk, rol });
  } else {
    // Look for email coincidence
    const emailUser = await Usuario.findOne({email: email});

    if(emailUser) {
      req.flash('error_msg', 'El correo ya es utilizado por otro usuario.');
      res.redirect('/users/signup');
    } else {
      // Saving a New User
  
      const newUser = new Usuario({ idempresa_fk,name, email, password,rol});
      newUser.password = await newUser.encryptPassword(password);
      console.log('NUEVO USUARIO ' + newUser);
      await newUser.save();
      req.flash('success_msg', 'Usuario creado.');
     // res.redirect('/users/signin');
     res.redirect('/empresasyusuario');
    }
  }
});


//EMPRESA CON SUS USUARIOS
//LISTAR TODAS LAS EMPRESAS
router.get('/empresasyusuario', isAuthenticated, async (req, res) => {
  //res.send(' empresas a la bdd');
  const empresa = await Empresa.find();
  
  //console.log('empresa ' + empresa);
  if (req.user.rol === '1')
  {
    res.render('empresa/empresa_usuario',{ empresa });
  }
  else
  {  
    var usuario = await Usuario.findById(req.user.id);
    const { idempresa_fk, name, email, password,rol , date } = usuario;
    const carga = await Carga.find({idempresa:idempresa_fk});
    res.render('transacciones/cargadas',{ carga });
    
  }
  
});



router.get('/users/usuario_por_empresa/:id', isAuthenticated,  async (req, res) => {
 // console.log('NUEVO USUARIO req.params.id ' + req.params.id);
  const usuario = await Usuario.find({idempresa_fk:req.params.id});
  /*if(note.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  } */
  res.render('users/usuarioporempresa', { usuario });
});



//EDITAR USUARIO

router.get('/users/edit/:id', isAuthenticated,  async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  /*if(note.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  } */
  res.render('users/editando-usuario', { usuario });
});


//GUARDANDO LOS DATOS EDITADOS DEL USUARIO isAuthenticated
router.put('/users/editado/:id', isAuthenticated, async (req, res) => {
  const { name, email,password,confirm_password } = req.body;
  await Usuario.findByIdAndUpdate(req.params.id, {name, email,password,confirm_password});
  req.flash('success_msg', 'Usuario actualizado con éxito');
  res.redirect('/empresasyusuario');
});

//ELIMINAR EMPRESA
router.delete('/users/eliminar/:id', isAuthenticated,  async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Usuario eliminado correctamente.');
  res.redirect('/empresasyusuario');
});








/*dbo.collection('Empresa').aggregate([
  { $lookup:
     {
       from: 'Usuario',
       localField: 'idEmpresa',
       foreignField: '_id',
       as: 'title'
     }
   }
  ]).toArray(function(err, res) {
  if (err) throw err;
  console.log(JSON.stringify(res));
  
});*/




module.exports = router;


/*
router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}));


*/
