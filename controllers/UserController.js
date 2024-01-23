const User = require("../models/User");
const jwt = require('jsonwebtoken');
const secretKey = "thisismysecretkey";
const bcrypt = require("bcrypt");

const Register = async (_username, _password, _email) => {
    try {
        let data = await User.create({ username: _username, password: _password, email: _email });
        if (data) {
            console.log("done");
        } else {
            console.log("error");
        }
    } catch (e) {
        console.error(e);
        throw new Error("Internal server error in controller");
    }
};

const Login = async (_email, _password) => {
    try {
        let user = await User.findOne({ email: _email });
        if (user) {
            // Comparing the given password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(_password, user.password);

            // If the password matches,i will generate the token
            if (passwordMatch) {
                const token = jwt.sign({ _id: user._id, email: user.email }, secretKey);
                console.log("ok you can enter");
                return { user, token };
            } else {
                console.log("Incorrect password");
            }
        } else {
            console.log("user not found");
            return { message: "User not found" };
        }
    } catch (e) {
        console.log("error in controller:", e);
        return { message: "Internal server error" };
    }
};

// when someone follow me it appears on my followers and appears on his
// folloing list and vise versa , so i've to exchange the id's of the follower and the 
// following

//user follow others
const Following = async (userId, following) => {
    try {
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { followings: following.followingId } },
        );
        
        await User.findOneAndUpdate(
            { _id: following.followingId },
            { $push: { followers: userId } },
        );
    } catch (error) {
        console.log("error in controller:", error);
        return { message: "Internal server error" };
    }
}

//when user have a follower
const Follower = async (userId, follower) => {
    try {
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { followers: follower.followerId } }
        );
        await User.findOneAndUpdate(
            { _id: follower.followerId },
            { $push: { followings: userId } }
        );
    } catch (error) {
        console.log("Error in controller:", error);
        return { message: "Internal server error" };
    }
}
//this is an old function i made on the lab i was willing to make the search and pagination from it but no time :)

const getAllUsers = async () => {
    try {
        let data = await User.find();
        if (data.length !== 0) {
            return data;
        } else {
            return "error";
        }
    } catch (e) {
        console.error(e);
        throw new Error("Internal server error in controller");
    }
};

module.exports = { Register, Login, getAllUsers , Following ,Follower};
