
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} 


const express         = require('express');
const exphbs          = require('express-handlebars');
const Handlebars      = require('handlebars')
const path            = require('path');
const methodOverride  = require('method-override');
const session         = require('express-session');
const flash           = require('connect-flash');
const passport        = require('passport');
const {allowInsecurePrototypeAccess}  = require('@handlebars/allow-prototype-access');
const helpers                         = require('handlebars-helpers')();
Handlebars.registerHelper(require('handlebars-helpers/lib/comparison'));



// Initializations
const app = express();

require('./database');
require('./config/passport');

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers:helpers
}));



app.set('view engine', '.hbs');

module.exports = function dateFormat(date, format, utc) {
  return (utc === true) ? moment(date).utc().format(format) : moment(date).format(format);
};

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));
// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require('./routes'));
app.use(require('./routes/users'));
app.use(require('./routes/empresa'));
app.use(require('./routes/archivo'));
app.use(require('./routes/catalogo'));
app.use(require('./routes/transacciones'));


// static files
app.use(express.static(path.join(__dirname, 'public')));



// Server is listening
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
