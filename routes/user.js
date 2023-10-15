const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { matchPasswordAndGenerateToken } = require('../models/user');


router.get('/sign-up', (req, res) => {
    return res.render('sign-up');
});

router.get('/sign-in', (req, res) => {
    return res.render('sign-in');
});

router.post('/sign-up', async (req, res) => {

    try {
        const {fullName, email, password} = req.body;
        const user = await User.findOne({ email });
        
        if(user){
          return res.status(422).json({
             message : 'User already exists, Go to the login page directly or create a new user',
          })
        }

        await User.create({
            fullName,
            email,
            password,
        })
        return res.status(201).json({
          message : 'User created successfully!',
        })
    }catch(err){
        console.log(err);
        return;
    }
});

router.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    try {

      const user = await User.findOne({ email });
      if(!user){
        return res.status(404).json({
          message: 'User not found, please go the register page first',
      })}

      const token = await User.matchPasswordAndGenerateToken(email, password);
      return res.cookie("token", token).redirect("/blog/add-blog");
    } catch (error) {
      return res.status(500).render("sign-in", {
        error: "Incorrect Email or Password",
      });
    }
  });
  
router.get("/logout", (req, res) => {
    return res.status(200).clearCookie("token").redirect("/");
  });
  

module.exports = router;

