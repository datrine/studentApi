let passport = require("passport");
let app = require("express")();
let LocalStrategy = require("passport-local").Strategy;
let Student = require("../model/studentModel")
let local= function (username, password, done) {
    Student.findOne({ username, password }, function (err, student) {     
        if (err) {
            console.log("error 1")
            console.log(err)
        }
        if (!student) {
            console.log("no user")
            return done(null, false, { message: "Incorrect user" })
        }
        if (student) {
            //console.log(user)
                    return done(null, student)
           /* bcrypt.compare(password, student.pass_hash, (err, res) => {
                //any err
                if (err) {
                    console.log("Error 2")
                    console.log(err)
                    return done(null, false, { message: "Incorrect pass" })
                }
                //if comparison is true
                if (!res) {
                    console.log("no pass")
                    return done(null, false, { message: "Incorrect pass" })
                }
                //if comparison is true
                if (res) {
                    //console.log("succeeded")
                    //console.log(user)
                    return done(null, user)
                }
            })*/
        }
    })
}

module.exports = (app) => {
    console.log("hhhh")
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (student, done) {
        done(null, student.id)
    });
    passport.deserializeUser(function (id, done) {
        Student.findById(id, function (err, gister) {
            console.log(err)
            done(err, gister);
        });
    });

    app.use('/', function (req, res, next) {
        if (!req.user) {
            passport.use(new LocalStrategy(local))
            passport.authenticate('local', function (err, user, info) {
                req.login_info = info
                if (err) {
                    console.log(err)
                    return next("route");
                }
                if (!user) {
                    console.log("not a logged in user")
                    return next("route")
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next("route");
                    }
                    console.log("logged in")
                    return next("route")
                });
            })(req, res, next);
        }
        else {
            return next("route")
        }
    });
    app.post("/login_notnow", (req, res, next) => {
        console.log("tryna get log")
        if (req.user) {
            return res.json({
                isLoggedIn: true, user: {
                    fname: req.user.fname,
                    lname: req.user.lname,
                    username: req.user.username,
                    email: req.user.email,
                    gname: req.user.gistname,
                }
            })
        }
        if (!req.user) {
            //log in from 
            if (req.body.username && req.body.password) {
                req.logIn({ username: req.body.username, password: req.body.password }, function (err) {
                    if (err) {
                        return res.json({ isLoggedIn: false, info: req.login_info })
                    }
                    console.log("logged in from parameters")
                    return res.json({
                        isLoggedIn: true, user: {
                            fname: req.user.fname,
                            lname: req.user.lname,
                            username: req.user.username,
                            email: req.user.email,
                            gname: req.user.gistname,
                        }
                    })
                });
            }


        }
    })
    app.get('/logout_notnow', function (req, res) {
        req.logout();
        res.json({ isLoggedIn: false })
    });
}