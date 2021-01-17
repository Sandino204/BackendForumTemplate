var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const userRouter = require('./routes/users')
const forumRouter = require('./routes/forum')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRouter)
app.use('/api/forum', forumRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    // success: false, 
    // message: 'Something was wrong'
    message: err.message, 
    err: err
  })
});

const server = app.listen(3000, () => {
  const port = server.address().port

  console.log("Servidor iniciado em http://localhost:" + port)
})

module.exports = app;
