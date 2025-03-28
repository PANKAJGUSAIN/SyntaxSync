const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName : {
        type: String ,
        required:true , 
        minLength : 4,
        maxLenght : 50

    },
    lastName : {
        type: String ,
    },
    emailId :{
        type: String , 
        minLength : 12,
        maxLenght : 50,
        required:true ,  //a required field
        unique : true ,  // a unique field 
        lowercase:true, // covert the text to lowercase
        trim:true,       // trims all the spaces
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password:{
        type : String , 
        required:true ,
        selected:false
    },
    age:{
        type: Number ,
        min : 18
    },
    gender:{
        type: String ,
        validate(value){  // by default run only for new document to run it for when updating documents use runValidator:true when querying
            if(!["male" , "female" , "others"].includes(value)){
            throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vhv.rs%2Fviewpic%2FihmxhJ_dummy-image-of-user-hd-png-download%2F&psig=AOvVaw3pLIueYEbJL9X3Swr-J-yY&ust=1743322175273000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCR1anrrowDFQAAAAAdAAAAABAE",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    about:{
        type:String,
        default:'This is a default value'
    },
    skills:{
        type:[String],
        validate: {
            validator: function (arr) {
                return arr.length <= 20;
            },
            message: "Skills array cannot have more than 20 items"
        }
    }
},{timestamps:true});
//time stamps automatically adds createdAt and updateAt 

const User = mongoose.model("User" , userSchema);

module.exports = {
    User
}