require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const {connectdb} = require('./config/database');
const {User} = require('./models/user');



app.post("/signup" , async(req ,res)=>{
    const userObj = {
        firstName: "John",
        lastName: "Doe",
        emailId: "johndoe@example.com",
        password: "securepassword123",
        age: 30,
        gender: "Male"
    }

    // create an instance of the usermodel
    const user = new User(userObj);

    await user.save();
    res.send("user added successfully !")


})


// to make sure database is connected before the server starts to listen 
connectdb()
.then(()=>{
    console.log("Database connected successfully...");
    app.listen(3000 , ()=>{
        console.log(`successfully listening to port ${3000}`);
    });
})
.catch((err)=>{
    console.error("Database cannot be connected!!")
});



