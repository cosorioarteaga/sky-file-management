const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArchivoSchema = new Schema({
    name: {
        type: String,
        required: true
       },
       
    size: {
        type: Number,
        required: true
    },
  
    mimetype: {
        type: String,
        required: true
    },

    md5: {
      type: String
        },

    file_path: {
        type: String
            },

    cantidad: {
        type: Number
        },

    estado: {
        type: Number
        },

       

   date: {
    type: Date,
    default: Date.now
  }


});

module.exports = mongoose.model('Archivo', ArchivoSchema);
