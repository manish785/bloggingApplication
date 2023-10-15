const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');
const dotenv = require('dotenv');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const port = process.env.PORT || 8000;

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
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

// route
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    //console.log(allBlogs);
    // blogs: allBlogs is passing the array of all blog entries to the template so that the template can use 
    // this data to generate the HTML content that will be displayed to the user
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
});

// middleware
app.use('/user', userRoute);
app.use('/blog', blogRoute);

//running the server
app.listen(port, function(err){
    if(err){
        console.log(`error while listening on ${port}`);
        return;
    }
    console.log(`Server is listening on: ${port}`);
});