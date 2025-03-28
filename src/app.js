require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const { connectdb } = require('./config/database');
const { User } = require('./models/user');

app.use(express.json()); // to convert json in a javascript object 

// signup api
app.post("/signup", async (req, res) => {
    console.log(req.body);

    // create an instance of the usermodel
    const user = new User(req.body);
    try {
        const result = await user.save();
        console.log(result);
        res.send("user added successfully !")
    } catch (err) {
        console.log("Error occured when adding user ", err.message);
    }

})

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



