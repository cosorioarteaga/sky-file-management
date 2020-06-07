const mongoose = require('mongoose');
const { Schema } = mongoose;

const RamoSchema = new Schema({
  ram_cod: {
        type: String,
        required: true
       },
       
  ram_descripcion: {
    type: String,
    required: true
  },
  
  date: {
    type: Date,
    default: Date.now
  },


});

module.exports = mongoose.model('Ramo', RamoSchema);
