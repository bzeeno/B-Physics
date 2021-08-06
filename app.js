//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const stripe = require("stripe")(process.env.API_SECRET_KEY);
const fs = require("fs");
var alert = require('alert');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
const videos = ["355791435","355450754","355450627","355450453","355450340","355450205","355450071","355449935","355407440","355407371","355407258","355411032","355449753","355449596","355449424","355431267","355431199","355431154","355431048","355430977","355403787","355403734","355430915","355430872","355430811","355430749","355430669","355430588","355430520","355430459","355430410","355430367","355403634","355403673","355430295","355430253","355430158","355430098","355430032","355429988","355429097","355429020","355428886","355428710","355403393","355403345","355428549","355407172","355411291","355411158","355403115","355402771","355428367","355412330","355412153","355412050","355411974","355411095","355411751","355405129","355411661","355411553","355411440","355403203","355404633","355405051","355404854","355404770","355406903","355409579","355409643","355410540","355409700","355405384","355406454","355406216","355405436","355408923","355408676","355408546","355409354","355409303","355409089","355411230"];
const videoNumbers = ["1A","1B","2A","2B","2B","2C","2D","2D","Science Video","Science Video","Science Video","Science Video","2E","2E","2F","2F","2G","2G","2H","2H","Section 2","Section 2","3A","3A","3B","3B","3C","3C","3D","3D","3E","3E","Section 3","Section 3","4A","4A","4B","4B","4C","4C","4D","4D","4E","4E","Section 4","Section 4","5A","Science Video","Science Video","Science Video","Science Video","Science Video","5B","5B","5C","5C","5D","Science Video","5E","5E","5E","5E","5E","6A","6B","6B","6B","6B","Science Video","Science Video","6C","6C","6C","6D","6D","6D","6D","6E","6E","6E","6E","6E","6E",""];
const videoNames = ["About The Course","Getting Your Environment Set-Up", "Why Python?","Data Types","Answers","Variables","Operators","Answers","Kinematics 1", "Kinematics 2", "kinematics 3", "Mass and Force","Formulas","Answers","Functions","Answers","Lists","Answers","Control Flow","Answers","Challenge 1 Answer","Challenge 2 Answer","Packages","Answers","Arrays","Answers","Numpy Functions and Arrays","Answers","Functions on Arrays","Answers","Numpy Functions and Constants","Answers","Challenge 1 Answer","Challenge 2 Answer","Our First Plot","Answers","Customizing Plots","Answers","Choosing What to Plot","Answers","Subplots","Answers","Subplots(Continued)","Answers","Challenge 1 Answer","Challenge 2 Answer","Python's Built-in Functions","Logarithms","Density","Energy, Power, and Light","Stars","Stellar Interiors","ASCII","Answers","ASCII(Continued)","Answers","CSV Files","Flux","FITS Files","Mini Project Setup","Answer 1","Answer 2","Answer 3","Explanation","Rockets","Rockets Answer: Part 1","Rockets Answer: Part 2","Rockets Answer: Part 3","Low Mass Stellar Evolution","High Mass Stellar Evolution","GAIA","GAIA Answer: Part 1","GAIA Answer: Part 2","MESA","MESA Answer: Part 1","MESA Answer: Part 2","MESA Answer: Part 3","Kepler 1","Kepler 2","Kepler 3","Kepler Answer: Part 1","Kepler Answer: Part 2","Kepler Answer: Part 3","End"];

// console.log(videos.length);
const beginUrl = "https://player.vimeo.com/video/";
let vidIndex = 0;
let prevIndex = 0;
let nextIndex = 0;
let fullVidUrl = "";
let fullVidUrlEnc = "";
let fullVid = "";
let prevVid = 0;
let nextVid = 0;
sectionNumber = "";
sectionName = "";
currentVidIndex = 0;
let failedLogin=false;


// Added by Youtube vid stripe
app.set(bodyParser.json());
// Using body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "A Secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI, { //"mongodb://localhost:27017/UserDB", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

///////////////////////////// Mongoose Schema /////////////////////////////
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);


///////////////////////////// Passport Initialize /////////////////////////////
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

///////////////////////////// Check if User is Logged in /////////////////////////////
function loggedIn(req, res) {
  if (req.isAuthenticated()) {
    return true;
  } else {
    return false;
  }
}


///////////////////////////// Home-Login-Register-Payment-Sections-Logout Get Methods /////////////////////////////
app.get("/", function(req, res) {
  loggedInStatus = loggedIn(req, res);
  // isPaidUser(req, loggedInStatus);
  res.render("home", {
    loggedInStatus: loggedInStatus,
    // paidUser: paidUser
  });
});

app.get("/login", function(req, res) {
    failedLogin = req.query.failedLogin;
    if(failedLogin == 'true'){
        res.render("login", {
          loggedInStatus: false,
          failedAttempt: true
        });
    }
    else {
        res.render("login", {
            loggedInStatus: false,
            failedAttempt: false
        });
    }
});

app.get("/register", function(req, res) {
  res.render("register", {
    loggedInStatus: false
  });
});


app.get("/buynow", function(req, res) {
  loggedInStatus = loggedIn(req, res);
  res.render("buynow", {
    loggedInStatus: loggedInStatus,
  });
});

app.get("/sections", function(req, res) {
  loggedInStatus = loggedIn(req, res);

  if (loggedInStatus) {
    res.render("sections", {
      loggedInStatus: loggedInStatus,
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/paysuccess", function(req, res) {
  loggedInStatus = loggedIn(req, res);
  res.render("paysuccess", {});
});

// get Method for video
app.get("/video", function(req, res){
    const path = "assets/4C.mp4";
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/,"").split("-");
        const start = parseInt(parts[0],10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        const chunksize = (end-start)+1;

        const file = fs.createReadStream(path, {start, end});
        const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
    }

});

app.get("/lesson", function(req, res){
   loggedInStatus = loggedIn(req, res);
   fullVid = req.query.fullVidUrlEnc;
   prevVid = req.query.prevVidIndex;
   nextVid = req.query.nextVidIndex;
   currentVidIndex = Number(prevVid)+1;
   sectionNumber = videoNumbers[currentVidIndex];
   sectionName = videoNames[currentVidIndex];
   res.render("lesson.ejs",{loggedInStatus: loggedInStatus, vidUrl: fullVid, prevI: prevVid, nextI: nextVid,sectionNumber: sectionNumber, sectionName: sectionName});
});

///////////////////////////// Post Methods /////////////////////////////
app.post("/register", function(req, res) {

    const token = req.body.stripeToken;
    const chargeAmount = 100;

    const charge = stripe.charges.create({
        amount: chargeAmount,
        currency: "usd",
        source: token
    }, function(err, charge) {
      if (err) {
        alert("Your card was declined");
        res.redirect("/register");
    } else{
        console.log("Your payment was successful");
        User.register({
          username: req.body.username,
        }, req.body.password, function(err, user) {
          if (err) {
            alert("There was an error processing your order");
            res.redirect("/register");
          } else {
            passport.authenticate("local")(req, res, function() {
              res.redirect("/paysuccess");
            });
          }
        });
    }
    });
});

app.post("/login", passport.authenticate('local', { successRedirect: '/sections',failureRedirect: '/login?failedLogin='+true}));

app.post("/charge", function(req, res) {
  const token = req.body.stripeToken;
  const chargeAmount = 5000;

  const charge = stripe.charges.create({
    amount: chargeAmount,
    currency: "usd",
    source: token
  }, function(err, charge) {
    if (0) {
      console.log("Your card was declined");
    }
  });
  console.log("Your payment was successful");
  res.redirect("/paysuccess");

});

app.post("/lesson", function(req,res){
    loggedInStatus = loggedIn(req, res);

    vidIndex = Number(req.body.course);
    console.log(req.body.course);
    prevIndex = vidIndex-1;
    nextIndex = vidIndex+1;

    fullVidUrl = beginUrl+videos[vidIndex];
    fullVidUrlEnc = encodeURIComponent(fullVidUrl);

    res.redirect("/lesson?fullVidUrlEnc="+fullVidUrlEnc+"&prevVidIndex="+prevIndex+"&nextVidIndex="+nextIndex);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
