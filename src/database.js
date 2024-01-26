// module of connection
const mongoose = require('mongoose');

// connection to the database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})
  .then(db => console.log('Db is connect'))
  .catch(err => console.error(err));
