const mongoose = require('mongoose');


const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({ 
  idempresa_fk : { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  password: { type: String, required: true },
  rol: { type: String, required: true },
  date: { type: Date, default: Date.now }
  
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('Usuario', UserSchema);