require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const { connectdb } = require('./config/database');
const { User } = require('./models/user');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const {userAuth} = require("./middleware/auth");

app.use(express.json()); // to convert json in a javascript object 
app.use(cookieParser()); //to parse cookie

// signup api
app.post("/signup", async (req, res) => {

    const { firstName, lastName, emailId, password } = req.body;

    // Validate req.body
    if (!emailId || !password || !firstName) {
        return res.status(400).send("Missing required fields: email, password, or name");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log(req.body);
    // create an instance of the usermodel
    const user = new User({ firstName, lastName, emailId, password: passwordHash });
    try {
        const result = await user.save();
        console.log(result);
        res.send("user added successfully !")
    } catch (err) {
        console.log("Error occured when adding user ", err.message);
    }

})

//login api 
app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;

    // Validate req.body
    if (!emailId || !password) {
        return res.status(400).send("Missing required fields: email or password");
    }

    try {
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        // generate the token
        const token = await jwt.sign(
            { _id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("token", token);

        res.status(200).send("Login successful");
    } catch (err) {
        console.error("Error occurred during login:", err.message);
        res.status(500).send("Internal server error");
    }
})

// profile api
app.get("/profile", userAuth ,  async (req, res) => {
    

    try {

        const user = req.user ; // as userdetails are attached in the header by the middleware

        res.status(200).send({
            message: "Token is valid",
            userProfile: user
        });
    } catch (err) {
        console.error("Error occurred while verifying token:", err.message);
        res.status(400).send("Invalid token");
    }
});


// find a specific user 
app.get("/user", async (req, res) => {
    try {
        const result = await User.find({ emailId: req.body.email });
        if (!result) {
            res.status(404).send("User not Found");
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(404).send("User not Found");
        console.log("Error occured when fetching  user ", err.message);
    }

})

// find all users 
app.get("/feed", async (req, res) => {
    try {
        const result = await User.find({});
        res.status(200).send(result);
    } catch (err) {
        res.status(404).send("User not Found");
        console.log("Error occured when fetching  user ", err.message);
    }

})

// delete specific user
app.delete("/user", async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.body.userId);
        res.status(200).send("User Deleted Successfully");
    } catch (err) {
        res.status(404).send("Error Ocuured ");
        console.log("Error occured when fetching  user ", err.message);
    }

})

// Update specific user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const { ...updateData } = req.body; // Extract userId and update data from the request body
    try {
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "skills"
        ]
        const isUpdateAllowed = Object.keys(updateData).every(k => ALLOWED_UPDATES.includes(k))

        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed")
        }
        // Find the user by ID and update their details
        const result = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

        if (!result) {
            return res.status(404).send("User not found");
        }

        res.status(200).send({
            message: "User updated successfully",
            updatedUser: result
        })

    } catch (err) {
        console.error("Error occurred while updating user:", err.message);
        res.status(400).send("Error occurred while updating user");
    }
});




// to make sure database is connected before the server starts to listen 
connectdb()
    .then(() => {
        console.log("Database connected successfully...");
        app.listen(3000, () => {
            console.log(`successfully listening to port ${3000}`);
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!")
    });



