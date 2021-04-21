const mongoose = require("mongoose");
const validator = require("validator");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const mongodb =
  "mongodb+srv://Zach:mongodbpassword@cluster0.2b1o6.mongodb.net/Kapstone?retryWrites=true&w=majority";

const db = mongodb;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database...");
  });

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
});

// user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A username is required."],
  },
  email: {
    type: String,
    required: [true, "An email is required."],
    validate: [validator.isEmail, "Valid email is required"],
  },
  password: {
    type: String,
    //to keep password hashed and secure in DB
    select: false,
    minlength: 6,
  },
  likedMovies: {
    type: Array,
  },
  movieBuddies: {
    type: Array,
  },
});
const User = mongoose.model("Users", userSchema);

//make a new user with a POST

// /users/signup  && /users/login
app.post("/users", (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).end();
  } else {
    const user = User.create(req.body);
    res.status(201).json({ user });
  }
});

app.post("/users/signup", (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).end();
  } else {
    const user = User.create(req.body);
    res.status(201).json({ user });
  }
});

//login endpoint
app.post("/users/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).end();
  } else {
    try {
      const user = await User.findOne({ username: req.body.username });
      console.log(user);
      res.status(201).send({ user, statusCode: 201 });
    } catch (error) {
      res.status(404).end();
    }
  }
});

// patch users, update a user
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//delete users
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// get a user for profile /users/:id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//get all users list
app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//add movie to liked movies array
app.post("/users/:id/likedmovies", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likedMovies: req.body },
      },
      { safe: true, upsert: true, new: true }
    );
    //user.likedMovies.push(req.body);
    res.status(200).json({ likedMovies: user.likedMovies });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//adding a movie buddy endpoint
app.post("/users/:id/moviebuddies", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id);
    user.movieBuddies.push(req.body);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// comment schema //////////////////////////////////////////////
const commentSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  text: {
    type: String,
  },
});
const Comment = mongoose.model("Comments", commentSchema);

//get comments in all /chatrooms/
app.get("/chatrooms", async (req, res) => {
  try {
    const Comments = await Comment.find();
    res.status(200).json({ Comments });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// post a comment in chatrooms
app.post("/chatrooms", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = Comment.create(req.body);
    res.status(201).json({ Comments });
  }
});

/////// comedy chatroom /////////////////////////////////
const ComedyComment = mongoose.model("ComedyComments", commentSchema);
app.get("/chatrooms/comedy", async (req, res) => {
  try {
    const Comments = await ComedyComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in comedy chatrooms
app.post("/chatrooms/comedy", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = ComedyComment.create(req.body);
    res.status(201).json({ Comments });
  }
});
////////////////////////////////////////////////////////////////

const ScifiComment = mongoose.model("ScifiComments", commentSchema);
app.get("/chatrooms/scifi", async (req, res) => {
  try {
    const Comments = await ScifiComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in scifi chatrooms
app.post("/chatrooms/scifi", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = ScifiComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

///////////////////////////////////////////////////////////////

const ActionComment = mongoose.model("ScifiComments", commentSchema);
app.get("/chatrooms/action", async (req, res) => {
  try {
    const Comments = await ActionComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in action chatrooms
app.post("/chatrooms/action", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = ActionComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

///////////////////////////////////////////////////////////////

const DocumentariesComment = mongoose.model(
  "DocumentariesComments",
  commentSchema
);
app.get("/chatrooms/documentaries", async (req, res) => {
  try {
    const Comments = await DocumentariesComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in action chatrooms
app.post("/chatrooms/documentaries", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = DocumentariesComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

////////////////////////////////////////////////////////////////

const HorrorComment = mongoose.model("HorrorComments", commentSchema);
app.get("/chatrooms/horror", async (req, res) => {
  try {
    const Comments = await HorrorComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in horror chatrooms
app.post("/chatrooms/horror", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = HorrorComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

////////////////////////////////////////////////////////////////

const KidComment = mongoose.model("KidComments", commentSchema);
app.get("/chatrooms/kid", async (req, res) => {
  try {
    const Comments = await KidComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in kid chatrooms
app.post("/chatrooms/kid", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = KidComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

////////////////////////////////////////////////////////////////

const ThrillerComment = mongoose.model("ThrillerComments", commentSchema);
app.get("/chatrooms/thriller", async (req, res) => {
  try {
    const Comments = await KidComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in thriller chatrooms
app.post("/chatrooms/thriller", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = ThrillerComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

////////////////////////////////////////////////////////////////

const AnimationComment = mongoose.model("AnimationComments", commentSchema);
app.get("/chatrooms/animation", async (req, res) => {
  try {
    const Comments = await AnimationComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in animation chatrooms
app.post("/chatrooms/animation", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = AnimationComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

///////////////////////////////////////////////////////////////

const UpcomingComment = mongoose.model("UpcomingComments", commentSchema);
app.get("/chatrooms/upcoming", async (req, res) => {
  try {
    const Comments = await UpcomingComment.find();
  } catch (error) {
    res.status(400).json(error.message);
  }
  res.status(200).json({ Comments });
});

// post a comment in upcoming chatrooms
app.post("/chatrooms/upcoming", (req, res) => {
  if (!req.body.username || !req.body.text) {
    res.status(400).json("username and text required").end();
  } else {
    const Comments = UpcomingComment.create(req.body);
    res.status(201).json({ Comments });
  }
});

////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  console.log("Get request received");
  res.send("Hello postman");
});

app.get("/comments", (req, res) => {
  res.json(db);
});

app.post("/comments", (req, res) => {
  db.push(req.body);
  res.status(201).json(db);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
