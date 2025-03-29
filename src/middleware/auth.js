const { User } = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user ; 
        next();
    }
    catch (err) {
        console.log("Error Occured", err.message);
        res.status(404).send("JWT not provided");
    }
}

module.exports = {
    userAuth
}