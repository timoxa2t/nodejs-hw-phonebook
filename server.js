require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose');

const connection = mongoose.connect(process.env.DB_HOST, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection.then(() => {
  app.listen(3000, () => {
    console.log("listening on port 3000")
  }) 
})
.catch(err => {
  console.log(err)
})

