var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")


//INDEX - show all campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
		}
	});
});



router.post("/", middleware.isLoggedIn ,function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: description, author: author};
	//push the new cp to database
	Campground.create(newCampground, function(err, newcampground){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	});

	
});


router.get("/new", middleware.isLoggedIn ,function(req, res){
	res.render("campgrounds/new");
})

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkOwnership , function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
			//does user own campground	

//UPDATE ROUTE
router.put("/:id", middleware.checkOwnership ,function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//DELETE ROUTE
router.delete("/:id", middleware.checkOwnership ,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});


module.exports = router;