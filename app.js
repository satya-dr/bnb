require('dotenv').config();

const port = process.env.PORT;
const dbUrl = process.env.DB_URL;

const express = require("express");
const session = require("express-session");
const mongoDbStore= require('connect-mongodb-session')(session);



const storeRouter = require("./Routes/storeRouter");
const hosterRouter = require("./Routes/hosterRouter");
const authRouter=require('./Routes/authRouter')


const errorHandel = require("./controllers/error");

const path = require("path");

const rootPath = require("./utils/pathUtils");

const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new mongoDbStore({
  uri:dbUrl,
  collection:'session'
})

app.use(express.static(path.join(rootPath, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret:"My name is satyajit",
  resave:false,
  saveUninitialized: true,
  store
}))


// app.use((req,res,next)=>{
//   console.log("Cookie checked middlewire",req.get('Cookie '));
//   req.isLoggedIn=req.get('Cookie')?req.get('Cookie').split('=')[1]==='true':false;
//   next();
// })
app.use((req, res, next) => {
 
  req.isLoggedIn = req.session.isLoggedIn ;
  next();
});



app.use(authRouter);
app.use((req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }else{
    res.redirect('/login');
  }
});
app.use(hosterRouter);
app.use(storeRouter);
app.use(errorHandel.pageNotFound);





mongoose.connect(dbUrl).then(()=>{
  console.log("connected to mongoose")
  app.listen(port, () => {
    console.log(`Port in localhost: ${port}`);
  });
}).catch(error=>{
  console.log("Error while connecting to mongodb: ",error)
})