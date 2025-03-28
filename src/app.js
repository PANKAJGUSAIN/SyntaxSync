require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const {connectdb} = require('./config/database');
const {User} = require('./models/user');

app.use(express.json()); // to convert json in a javascript object 


app.post("/signup" , async(req ,res)=>{
    console.log(req.body);

    // create an instance of the usermodel
    const user = new User(req.body);
    try{
        const result = await user.save();
        console.log(result);
        res.send("user added successfully !")
    }catch(err){
        console.log("Error occured when adding user " , err.message);
    }
    
    


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



