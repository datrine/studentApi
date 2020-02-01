var mongoose=require("mongoose");
var studentSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true,
    },
    mname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true,
    },
    prof_pic:{
        type:String
    },
    prof_vid:{
        type:String
    },
    gender:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:[true,"Date Of Birth field is required"],
    },
    email:{
        type:String,
        required:[true,"Email field is required"],
    },
    username:{
        type:String,
        required:[true,"password is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    department:{
        type:String,
        required:[true,"department field is required"]
    },
    faculty:{
        type:String,
        required:[true,"faculty field is required"]
    },
})

let Student=mongoose.model("Student",studentSchema);
module.exports=Student;

