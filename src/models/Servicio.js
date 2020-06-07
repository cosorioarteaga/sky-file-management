const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServicioSchema = new Schema({
  ser_cod: {
        type: String,
        required: true
       },
       
  ser_descripcion: {
    type: String,
    required: true
  },
  
  date: {
    type: Date,
    default: Date.now
  },


});

module.exports = mongoose.model('Servicio', ServicioSchema);
