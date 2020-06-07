const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmpresaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
identificacion: {
 type: Number,
 required: true
},

numcolenvia: {
  type: Number,
  required: true
 },

numcolrecibe: {
  type: Number,
  required: true
 },

 columna_debito: {
  type: String,
  required: true
 }


});

module.exports = mongoose.model('Empresa', EmpresaSchema);
  
