var express = require('express')
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");


//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index");

seedDB();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("//mongodb://localhost/yelp_camp", {useNewUrlParser: true,
useCreateIndex: true
}).then(() =>{
	console.log("connected to db!");	
}).catch(err => {
	console.log("ERROR: " + err.message);
});
//mongodb+srv://Goorm:goorm@yelpcamp.mkosz.mongodb.net/yelp_camp?retryWrites=true&w=majority

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Whoops it is not trial",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


//PORT ROUTE
app.listen(3000, function(){
	console.log("Server started!");
});

