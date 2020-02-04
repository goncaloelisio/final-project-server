const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const protect = require("./middleware/check-auth");
require ('dotenv').config()
const app = express();

var sess = {
  secret: process.env.sessionSecret,
  cookie: {}
}
 
app.use(session(sess))
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/places', protect, placesRoutes); 
app.use('/api/users', usersRoutes);
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
.connect(process.env.MongoDB)
.then(() => {
    app.listen(process.env.PORT, ()=>{
      console.log("Listening on port number", process.env.PORT)
    });
})
.catch(err => {
  console.log(err);
});