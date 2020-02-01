var express=require("express");
var app=express();
var path=require("path")
var mongoose=require("mongoose")
var logger=require("morgan")
var cors=require("cors")
app.use(cors())

//create a server-based session object
var session = require("express-session");

//create store in the db to save session
var MongoDBStore = require("connect-mongodb-session")(session);
  
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/studentdb',
  //databaseName: "heroku_b2g7qwz1",
  collection: "mySessions"
}, (err) => { console.log(err) });

store.on("error", (err) => {
  console.log(err)
});

//use session as middleware, connecting db store with session
app.use(session({ secret: "studentapp", store: store, saveUninitialized: true, resave: true }));

mongoose.connect("mongodb://localhost:27017/studentdb",{useNewUrlParser:true})
mongoose.connection.on("error",(err)=>{
    console.log(err)
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads",express.static('uploads'));
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

var studentRouter=require("./routes/student")
require("./routes/auth")(app)
app.get("/",(req,res,next)=>{
    res.sendFile(__dirname+"/public/html/index.html")
});
app.get("/index",(req,res,next)=>{
    res.sendFile(__dirname+"/public/html/index.html")
});
app.use("/student",studentRouter);

app.use("/",(req,res,next)=>{
    //res.sendFile("./public/html/index.html")
})
app.listen(5000,()=>{
    console.log("listening");
})