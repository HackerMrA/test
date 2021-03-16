const express=require('express'),
      app=express(),
      morgan=require('morgan'),
      cookieParser=require('cookie-parser'),
      dotenv=require('dotenv'),
      bodyParser=require('body-parser'),
      mongoose=require('mongoose');

const http = require('http').Server(app);
      io = require('socket.io')(http);


dotenv.config();

//routes
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');


//db
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('DB connected!');
});

mongoose.connection.on('error',err=>{
    console.log(`error:${err.message}`)
})


//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//using routes
app.use('/',authRoutes);
app.use('/',userRoutes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({error:"Unauthorized!"});
    }
    next();
});

io.on('connection', (socket) => {
    console.log('a user connected');
});
  

http.listen(8080,()=>{
    console.log('server is running')
})
