var Campground = require("../models/campground");
var Comment = require("../models/comment");
//middleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Login required to access this page!");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //is user logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("campgrounds");
        } else {
            if(!foundCampground) {
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            //author id is a mongoose object, and user id is a string. Compare using mongoose function .equals()
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "Login required to access this page!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            console.log(err);
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            //author id is a mongoose object, and user id is a string. Compare using mongoose function .equals()
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;