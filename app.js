var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var helmet = require('helmet');
const { default: mongoose } = require('mongoose');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser:true,useUnifiedTopology:true},
    ()=>{
    console.log('connected to mongodb')
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var postsRouter = require('./routes/posts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter );
app.use('/api/posts', postsRouter );


app.listen(3000,()=>{
    console.log('server runnin on port 3000')
  });

module.exports = app;
