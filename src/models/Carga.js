const mongoose = require('mongoose');
const { Schema } = mongoose;

const CargaSchema = new Schema({
    idempresa: {
        type: String,
        required: true
       },
       
    idservicio: {
        type: String,
        required: true
    },
  
    idramo: {
        type: String,
        required: true
    },

    rutafile: {
      type: String
  },

  nombrefile: {
    type: String
},

estado: {
  type: Number
},

cantidadregistros: {
  type: Number
},

  date: {
    type: Date,
    default: Date.now
  },


});

module.exports = mongoose.model('CargaS', CargaSchema);
