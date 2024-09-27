var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

var productsRouter = require('./routes/products'); // Pastikan file ini ada dan sudah benar

var app = express();

// Pengaturan
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // Gunakan 'pug' karena Jade telah diganti

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rute
app.use('/products', productsRouter);

// Catch 404 dan forward ke error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, hanya menyediakan error di environment development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render halaman error
  res.status(err.status || 500);
  
  // Pastikan file 'error.pug' ada di folder 'views'
  res.render('error');
});

module.exports = app;
