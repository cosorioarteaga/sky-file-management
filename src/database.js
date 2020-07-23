const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}) 
    .then(db => console.log(`DB is connected`))
    .catch(err => console.error(err));


/*

const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true    });

const db = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};*/
/*
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://matias2010:matias2010@cluster0-vufyt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('Conectado a la BDD...');
  // perform actions on the collection object
  client.close();
});*/

/*
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/gestion-archivos-db', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));*/