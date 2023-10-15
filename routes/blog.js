const { validateToken } = require('../services/authentication')
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");



// for uploading the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-blog", (req, res) => {
  const token = req.cookies.token;

  try {
     validateToken(token);

    return res.render("addBlog", {
      user: req.user,
    });
  }catch(err){
      console.log('error', err);
      return;
  }
});

router.get("/:id", async (req, res) => {
   const token = req.cookies.token;
   try {
      validateToken(token);

      const blog = await Blog.findById(req.params.id);
      const comments = await Comment.find({ blogId: req.params.id })
      return res.render("blog", {
        user: req.user,
        blog,
        comments,
    });
   }catch(err){
      console.log('error', err);
      return;
   }  
});


router.post("/comment/:blogId", async (req, res) => {
  const token = req.cookies.token;

  try{
      validateToken(token);
      await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
      });
    return res.redirect(`/blog/${req.params.blogId}`);
  }catch(err){
      console.log('error', err);
      return;
  }
});


router.post("/", upload.single("coverImage"), async (req, res) => {
  const token = req.cookies.token;
  
  try{
      validateToken(token);

      const { title, body } = req.body;
      const blog = await Blog.create({
        body,
        title,
        createdBy : req.cookies.user,
      });
    return res.redirect(`/blog/${blog._id}`);
  }catch(err){
      console.log('error', err);
      return;
  }
});

module.exports = router;
