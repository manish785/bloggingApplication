const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const dotenv = require('dotenv');
const port = 8080;

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

 
//connect to database
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connection Succesful"))
.catch((err)=>{
    console.log(err);
    return;
});

// parse the form data
app.use(express.urlencoded({ extended : false }));

// route
app.get('/', (req, res) => {
    return res.render('home');
})

// middleware
app.use('/user', userRoute);

//running the server
app.listen(port, function(err){
    if(err){
        console.log(`error while listening on ${port}`);
        return;
    }
    console.log(`Server is listening on ${port}`);
})