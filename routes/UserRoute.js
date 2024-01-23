const userController = require("../controllers/UserController");
const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const secretKey = "thisismysecretkey"


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
// register
route.post("/register", async (req, res) => {
  console.log(req.body);
  let { username, password, email } = req.body;
  bcrypt.hash(password, saltRounds, async function (err, hash) {
      try {
          let data = await userController.Register(username, hash, email);
          res.status(200).json({ message: "User registered successfully" });
      } catch (error) {
          res.status(500).json({ message: error.message || "Internal server error in route" });
      }
  });
});



//login
route.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let data = await userController.Login(email, password);
    console.log("Login data from controller:", data);

    if (data) {
      res.status(200).json({ message: "User logged in successfully", token: data.token });
    } else {
      res.status(401).json({ message: "error in token" });
    }
  } catch (error) {
    console.log("Error in login route:", error);
    res.status(500).json({ message: "Internal server error in route" });
  }
});


//following

route.get('/following/:userId', verifyToken, async (req, res) => {
  try {
    let followingId = req.body;
    let userId = req.params.userId;
    jwt.verify(req.token, secretKey,async (err, authData) => {
      if(authData){
          let data = await userController.Following(userId,followingId);
          res.status(200).json({ message: "you start following successfully" });
          
      }else{
          res.sendStatus(403);
      }})

  } catch (error) {
      console.error('Error in follow route:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


route.get('/follower/:userId', verifyToken, async (req, res) => {
  try {
    let followerId = req.body;
    let userId = req.params.userId;
    jwt.verify(req.token, secretKey, async (err, authData) => {
      if (authData) {
        let data = await userController.Follower(userId, followerId);
        res.status(200).json({ message: "you have a new follower" });

      } else {
        res.sendStatus(403);
      }
    });

  } catch (error) {
    console.error('Error in follower route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//this is an old function i made on the lab i was willing to make the search from it but no time :)

//return the name of the registere user
// route.get('/',async(req,res)=>{
//     try {
//         let data = await userController.getAllusers();
//         res.status(200).json({ message: data });

//     } catch (error) {
//         res.status(500).json({ message: "Internal server error" });
//     }
// })


module.exports = route;
