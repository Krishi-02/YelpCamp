var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
	res.render("landing");
});


//register form
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password , function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//login form
router.get("/login", function(req, res){
	req.flash("error", "Please Login First");
	res.render("login");
});

router.post("/login" ,passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	return res.redirect("/login");
}

module.exports = router;
