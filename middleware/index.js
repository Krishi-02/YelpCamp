//middleware
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkOwnership = function(req, res, next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			req.flash("error", "campground not found");
			res.redirect("back");
		}
		else{
			//does user own campground
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}
			else{
				req.flash("error", "You don;t have permission to do that");
				res.redirect("back");
			}
		}
	});	
	}
	else{
		req.flash("error", "Please Login First");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.comment_idid, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else{
			//does user own campground
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}
			else{
				res.redirect("back");
			}
		}
	});	
	}
	else{
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "please login first");
	return res.redirect("/login");
}

module.exports = middlewareObj;