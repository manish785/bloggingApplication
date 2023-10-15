const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      // required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    // here, linking the blog through the User
    createdBy: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment = model('comment', commentSchema);

module.exports = Comment;
