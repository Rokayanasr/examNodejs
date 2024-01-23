const mongoose = require("mongoose");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const port = 6565;
const userRoute = require("./routes/UserRoute");
const blogRoute = require("./routes/BlogRoute");
const secretKey = "thisismysecretkey"

mongoose
  .connect("mongodb://127.0.0.1:27017/blogging")
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/user", userRoute);
app.use("/home", blogRoute);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
  } else {
      res.sendStatus(403);
  }
}
app.listen(port, () => console.log(`Hello i'm listening on port ${port}!`));
