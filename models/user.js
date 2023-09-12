const { createHmac, randomBytes } = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
       // required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png",
      },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
}, {
    timestamps: true,
});

// hashing the password, before saving the user into the database
userSchema.pre("save", function (next) {
    const user = this;
  
    if (!user.isModified("password")) return;
  
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");
  
    this.salt = salt;
    this.password = hashedPassword;
  
    next();
  });

  userSchema.static(
    "matchPasswordAndGenerateToken",
    async function (email, password) {
      const user = await this.findOne({ email });
      if (!user) throw new Error("User not found!");
  
      const salt = user.salt;
      const hashedPassword = user.password;
  
      const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
       
      if(hashedPassword !== userProvidedHash) 
         throw new Error("Incorrect Password");
      
    //   return {...user._doc , password: undefined, salt: undefined};
    return user;
        
  
    //   const token = createTokenForUser(user);
    //   return token;
    }
  );
  

const User = mongoose.model('User', userSchema);
module.exports = User;












