const express = require('express');
const app = express();
const usermodel = require("./models/user");
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const postmodel = require("./models/post");
const jwt = require('jsonwebtoken');
// const multer  = require('multer')
// const crypto = require('crypto');
const upload = require("./config/multer");
const fs = require("fs");
//const bcrypt = require("bcrypt");
const session = require("express-session");


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());


// //multer use & data upload on server:
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/uploads')
//   },
//   filename: function (req, file, cb) {
//    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//    //create unique file name:
//    crypto.randomBytes(12, (err,bytes)=>{
//     const fn= bytes.toString('hex') + path.extname(file.originalname)
//     cb(null, fn)
//   })
//   }
// }) 

// const upload = multer({ storage: storage })

//route:
app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/", (req, res) => {
  res.render("index");
});

//route to login page
app.get("/login",(req, res) => {
  res.render("login");
});

app.get("/profile",islogged_in, async (req,res)=>{
  let user = await usermodel.findOne({email:req.user.email}).populate("post");
 // console.log(user)
 //user.populate("posts"); 
  res.render("profile",{user});  
});
//post blog:
app.post("/post",islogged_in, async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let {content}=req.body;
    let post = await postmodel.create({
      user:user._id,
      content
    })
    user.post.push(post._id);
    await user.save();
    res.redirect("/profile");  
 });

//like:
 app.get("/like/:id",islogged_in, async (req,res)=>{
  let post = await postmodel.findOne({_id:req.params.id}).populate("user");
  if(post.Likes.indexOf(req.user.userid)=== -1){
    post.Likes.push(req.user.userid);
  }
  else{
    post.Likes.splice(post.Likes.indexOf(req.user.userid), 1);
  }

  await post.save();
  res.redirect("/profile");  
});

//edit:
app.get("/edit/:id",islogged_in, async (req,res)=>{
  let post = await postmodel.findOne({_id:req.params.id}).populate("user");
  res.render("edit",{post});  
});

//update:
app.post("/update/:id",islogged_in, async (req,res)=>{
  let post = await postmodel.findOneAndUpdate({_id:req.params.id},{content: req.body.content})
  res.redirect("/profile");  
});

//delete
app.get("/delete/:id", async (req,res)=>{
  let deleteduser =  await postmodel.findOneAndDelete({ _id: req.params.id});
 res.redirect("/profile");   
})

//account creation:
app.post("/create", async (req, res) => {
  const { username, name, age, email, password } = req.body;

  // before creating check that user account with that email is already exist or not:
  let user = await usermodel.findOne({ email });
  if (user) return res.status(409).send("User with this Email is already Exist")

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await usermodel.create({
        username, name, age, email, password: hash
      });

    let token = jwt.sign({email:email,userid:user._id},"secret");
    res.cookie("token",token);
     // res.send("registered")
      res.redirect("/profile");
    })

  })

});

//login  ****
app.post("/login", async (req, res) => {
  const {email, password} = req.body;

  // before creating check that user account with that email is already exist or not:
  let user = await usermodel.findOne({ email });
  if (!user) return res.status(500).send("Something Went Wrong!")

  bcrypt.compare(password,user.password,(err,result) =>{
            if(result) {
                  let token = jwt.sign({email:email,userid:user._id},"secret");
                  res.cookie("token",token);
                  res.status(200).redirect("/profile");
          }
            else res.redirect("/login");
      })
  });

//logout:  ****
app.get("/logout", (req, res) => {
  res.cookie("token","")
  res.redirect("/login");
});

//middleware for protected routes so auth, can only go to that route.:login->profile
//if not loged in then you have to login first that's why. a Protected Route.
 function islogged_in(req,res,next){
  if(req.cookies.token === "") res.redirect("/login")
  else{
      let data = jwt.verify(req.cookies.token,"secret")
      req.user = data
      next();
    }
 }

// // for learning multer:
// app.get("/test",(req,res)=>{
// res.render("test");
// });

// //upload route:
// app.post("/upload", upload.single('image'), (req,res)=>{
//   // body have all text regarding it but // file data is in the "req.file"
// console.log(req.file);
// });

//disk storage: to upload on server and //memory storage: to upload on Database. 
//profile upload page
app.get("/profile/upload", (req, res) => {
  res.render("pro_upload");
});
//upload image ********
app.post("/upload", islogged_in, upload.single("image") , async (req, res) => {
   let user = await usermodel.findOne({email: req.user.email});
   user.profilepic = req.file.filename;
   user.save();
   res.redirect("/profile");

});

//image remove:
app.post("/remove", islogged_in, async (req, res) => {
 
  let user = await usermodel.findOne({ email: req.user.email });
  if (user.profilepic && user.profilepic !== "default.png") {
      const imagePath = path.join(__dirname, "public/images/uploads", user.profilepic);
      // Check if file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    // Reset profile picture to default.png:
    user.profilepic = "default.png";
    await user.save();
    res.redirect("/profile");
  }
);




/************************************************************************************/
/************************************************************************************/
/************************************************************************************/
//for thunder client api testing: USERS
// create user:
app.post("/users", async (req, res) => {
  try {
      const { name, email, password } = req.body;
      let user = new usermodel({ name, email, password });
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});
//read data:
app.get("/users", async (req, res) => {
  try {
      let users = await usermodel.find();
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});
// update:
app.put("/users/email/:email", async (req, res) => {
  try {
      const { email } = req.params;
      const { name, password } = req.body;

      let updatedUser = await usermodel.findOneAndUpdate(
          { email: email }, // Find user by email
          { name, password }, // Update fields
          { new: true } // Return updated user
      );

      if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});
//delete:
app.delete("/users/email/:email", async (req, res) => {
  try {
      const { email } = req.params;

      let deletedUser = await usermodel.findOneAndDelete({ email: email });

      if (!deletedUser) {
          return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});

/************************************************************************************/
/************************************************************************************/
/************************************************************************************/
//for thunder client api testing: USERS's POSTS:
//create new post
app.post("/users/:email/posts", async (req, res) => {
  try {
      const { email } = req.params;
      const { content } = req.body;

      // Find user
      let user = await usermodel.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Create a new post
      let newPost = new postmodel({ content, user: user._id });
      await newPost.save();

      // Add post to user's post array
      user.post.push(newPost._id);
      await user.save();

      res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});
//read all post of that user
app.get("/users/:email/posts", async (req, res) => {
  try {
      const { email } = req.params;

      // Find user and populate their posts
      let user = await usermodel.findOne({ email }).populate("post");

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: user.name, email: user.email, posts: user.post });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//update post by id:
app.put("/users/:email/posts/:postId", async (req, res) => {
  try {
      const { email, postId } = req.params;
      const { newContent } = req.body;

      // Find user
      let user = await usermodel.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Find post by ID
      let post = await postmodel.findById(postId);

      if (!post) {
          return res.status(404).json({ error: "Post not found" });
      }

      // Update post content
      post.content = newContent;
      await post.save();

      res.json({ message: "Post updated successfully", post });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});
//delete post by id:
app.delete("/users/:email/posts/:postId", async (req, res) => {
  try {
      const { email, postId } = req.params;

      // Find user
      let user = await usermodel.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Find post by ID
      let post = await postmodel.findById(postId);

      if (!post) {
          return res.status(404).json({ error: "Post not found" });
      }

      // Remove post from database
      await postmodel.findByIdAndDelete(postId);

      // Remove post from user's post array
      user.post = user.post.filter(p => p.toString() !== postId);
      await user.save();

      res.json({ message: "Post deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});
/********************************************************************************************/
/********************************************************************************************/

// // login for api testing: *********
// // Middleware to set up session******
// app.use(session({
//     secret: "secret", // Change this to a strong secret
//     resave: false,
//     saveUninitialized: true
// }));
// //login from api testing:
// app.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user by email
//         let user = await usermodel.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ error: "User not found" });
//         }

//         // Compare password with hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: "Invalid credentials" });
//         }

//         // Store user ID in session
//         req.session.user = user;

//         res.json({ message: "Login successful", user });
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// //for protection through API:
// const isLoggedIn = (req, res, next) => {
//     if (!req.session.user) {
//         return res.status(401).json({ error: "Unauthorized! Please log in first." });
//     }
//     next();
// };

// // get profile after login also as protected middleware is used here.
// app.get("/profile",isLoggedIn, async (req, res) => {
//   let user = await usermodel.findOne({ email: req.session.user.email }).populate("post");
//   res.render("profile", { user });
// });

// //logout for api testing at backend! ********
// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//       if (err) {
//           return res.status(500).json({ error: "Logout failed" });
//       }
//       res.json({ message: "Logout successful" });
//   });
// });





//port: 
app.listen(3000);