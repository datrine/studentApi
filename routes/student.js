var express = require("express");
var route = express.Router();
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
var upload = multer({ storage: storage })
var Student = require("../model/studentModel")

route.get("/register/", (req, res, next) => {
    res.sendFile("C:/Users/DELL/studentApi/public/html/register.html")
});

let cpUpload = upload.fields([
    { name: "prof_pic", maxCount: 1 },
    { name: "prof_vid", maxCount: 1 }
])

//registration api for new student
route.post("/register", cpUpload, (req, res, next) => {
    let data = req.body.student || req.body;
    console.log(req.body)
    console.log(req.files["prof_vid"][0])
    let newStudent = new Student({
        prof_pic: "uploads/" + req.files["prof_pic"][0].filename,
        prof_vid: "uploads/" + req.files["prof_vid"][0].filename,
        lname: data.lname,
        mname: data.mname,
        fname: data.fname,
        gender: data.gender,
        username: data.username,
        password: data.password,
        dob: data.dob,
        faculty: data.faculty,
        department: data.department,
        email: data.email,
    })
    newStudent.save((err, student) => {
        if (err) {
            return res.json({ saved: false, err })
        }
        if (!student) {
            return res.json({ saved: false, info: "Student not saved" })
        }
        if (student) {
            return res.json({ saved: true, user: student })
        }
    })
})

//post API for a logged-in user: fetches user data
route.post("/portal/:id", (req, res, next) => {
    let id = req.params.id
    console.log(id)
    Student.findById(id, (err, student) => {
        if (err) {
            return res.json({ err })
        }
        if (!student) {
            return res.json({ info: "Student not found" })
        }
        if (student) {
            return res.json({
                user: {
                    fname: student.fname,
                    lname: student.lname,
                    mname: student.mname,
                    username: student.username,
                    email: student.email,
                    faculty: student.faculty,
                    department: student.department,
                    gender: student.gender,
                    prof_pic: student.prof_pic,
                    prof_vid: student.prof_vid,
                    email: student.email,
                    password: student.password,
                    id: student._id
                }
            })
        }
    })
});

//API for attempting to log in a new user
route.post("/login", (req, res, next) => {
    let { username, password } = req.body
    console.log(username)
    console.log(password)

    /*Student.findOne({
       $and: [
           { username: username },
           { password: password }
       ]
   }, (err, student) => {
       if (err) {
           console.log(err)
           return res.json({ loggedIn: false, err })
       }
       if (!student) {
           return res.json({ loggedIn: false })
       }
       if (student) {
           console.log(student)
           return res.json({ loggedIn: true, student })
       }
   })*/
    console.log(`req.user: ${req.user}`)
    if (req.user) {
        return res.json({
            isLoggedIn: true, user: {
                fname: req.user.fname,
                lname: req.user.lname,
                mname: req.user.mname,
                username: req.user.username,
                email: req.user.email,
                faculty: req.user.faculty,
                department: req.user.department,
                gender: req.user.gender,
                prof_pic: req.user.prof_pic,
                prof_vid: req.user.prof_vid,
                email: req.user.email,
                password: req.user.password,
                id: req.user._id
            }
        })
    }
    if (!req.user) {
        //log in with username && password
        console.log(username)
        console.log(password)
        if (username && password) {
            req.logIn({ username: req.body.username, password: req.body.password }, function (err) {
                if (err) {
                    return res.json({ isLoggedIn: false, info: req.login_info })
                }
                return res.json({
                    isLoggedIn: true, user: {
                        fname: req.user.fname,
                        lname: req.user.lname,
                        mname: req.user.mname,
                        username: req.user.username,
                        email: req.user.email,
                        faculty: req.user.faculty,
                        department: req.user.department,
                        gender: req.user.gender,
                        prof_pic: req.user.prof_pic,
                        prof_vid: req.user.prof_vid,
                        email: req.user.email,
                        password: req.user.password,
                        id: req.user._id
                    }
                })
            });
        }
        else {
            return res.json({ info: "Login parameters not complete" })
        }
    }
});

route.get('/logout', function (req, res) {
    req.logout();
    res.json({ isLoggedIn: false })
});

route.post("/delete_account", (req, res, next) => {
    let student = req.user;
    Student.remove({ id: { $eq: student.id } }, (err) => {
        if (err) {
            return res.json({ err })
        }
        return res.json({ info: "Account deleted" })
    })
});

route.post("/change_pass", (req, res, next) => {
    let data = req.body;
    let student = req.user;
    if (student) {
        Student.updateOne({ id: { $eq: student.id } },
            { $set: { "password": password } },
            (err, student) => {
                if (err) {
                    return res.json({ err, info: "Password change failed" })
                }
                if (!student) {
                    return res.json({ info: "Password change failed" })
                }
                if (student) {
                    res.status = 200;
                    return res.json({ info: "Password change successful" })
                }
            })
    }
});
module.exports = route;