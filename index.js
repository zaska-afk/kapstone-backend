const express = require("express");
const app = express();
const port = 3000;

const db = {
  comments: [
    { text: "test todo 1", id: 1 },
    { text: "test todo 2", id: 2 },
    { text: "test todo 3", id: 3 },
    { text: "test todo 4", id: 4 },
    { text: "test todo 5", id: 5 },
  ],
  users: [
    { username: "Zach", password: "1234", id: 1 },
    { username: "Anna", password: "asdf", id: 2 },
  ],
  messages: [{ text: "This movie is great", id: 1 }],
};

app.use(express.json());

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

app.get("/", (req, res) => {
  console.log("Get request received");
  res.send("Hello postman");
});

app.get("/todos", (req, res) => {
  res.json(db);
});

app.post("/todos", (req, res) => {
  db.push(req.body);
  res.status(201).json(db);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
