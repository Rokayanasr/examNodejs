const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const BlogController = require('../controllers/BlogController');
const jwt = require('jsonwebtoken');
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

router.post('/createBlog/:userId', verifyToken,async (req, res) => {
    try {
        let { title, body, photo ,tags} = req.body;
        let author = req.params.userId
        jwt.verify(req.token, secretKey,async (err, authData) => {
            if(authData){
                let data = await BlogController.addBlog(title, body, photo, author, tags);
                res.status(200).json({ message: "Blog added successfully" });
                
            }else{
                res.sendStatus(403);
            }
        })
    } catch (err) {
        res.json({ message: err });
    }
});

router.patch('/editBlog/:blogId', verifyToken, async (req, res) => {
    try {
        let { title, body } = req.body;
        let id = req.params.blogId;

        jwt.verify(req.token, secretKey, async (err, authData) => {
            if (authData) {
                let data = await BlogController.editBlog(id, title, body);
                res.status(200).json({ message: "Blog edited successfully" });
            } else {
                res.sendStatus(403);
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.patch('/editBlog/:blogId', async (req, res) => {
    try {
        let { title, body } = req.body;
        let id = req.params.blogId

        let data = await BlogController.editBlog(id, title, body);
        res.status(200).json({ message: "Blog edited successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error in route" });
    }
});

module.exports = router;
