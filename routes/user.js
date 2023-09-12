const express = require('express');
const router = express.Router();
const User = require('../models/user');



router.get('/sign-up', (req, res) => {
    return res.render('sign-up');
});

router.get('/sign-in', (req, res) => {
    return res.render('sign-in');
});

router.post('/sign-up', async (req, res) => {

    try {
        const {fullName, email, password} = req.body;
        await User.create({
            fullName,
            email,
            password,
        })
    }catch(err){
        console.log(err);
        return;
    }
    return res.status(201).json({
        message : 'User created successfully!'
    })
});

router.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    // try {
      const user = await User.matchPasswordAndGenerateToken(email, password);
      
      console.log('User' , user);
      return res.redirect('/');
    //   return res.cookie("token", token).redirect("/");
    // } catch (error) {
    //   return res.render("signin", {
    //     error: "Incorrect Email or Password",
    //   });
    // }
  });
  
//   router.get("/logout", (req, res) => {
//     res.clearCookie("token").redirect("/");
//   });
  


module.exports = router;

