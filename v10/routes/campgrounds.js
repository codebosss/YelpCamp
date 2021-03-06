var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTE -Show all campgrounds
router.get("/",function(req,res){
	//get all the campgrounds from the DB
	Campground.find({},function(err,allCampgrounds){
		if(err)
			console.log(err);
		else
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
	});
});


//CREATE - add a new campground to the database
router.post('/',middleware.isLoggedIn,function(req,res){
    var name=req.body.name;//body parser is used here because this is a post request otherwise just  query keyword can be used
    var image=req.body.image;
    var desc=req.body.description;
    var author={
    	id:req.user._id,
    	username:req.user.username
    };
    var newCampground={name:name,image:image,description:desc,author:author};
    //Create a new campground and save to DB
    Campground.create(newCampground,function(err,newlyCreatedCampground){
    	if(err)
    		console.log(err);
    	else
    		//redirect to campgrounds page
    		res.redirect("/");
    });
});


//NEW ROUTE - show form to create new campground
router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render('campgrounds/new');
});


//SHOW - show info of one campground
router.get("/:id",function(req,res){
	//find the campground with provided id and show the template(the ejs file)
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err)
			console.log(err);
		else{
			res.render("campgrounds/show",{campground:foundCampground});	
		}
	});
})

//EDIT - 
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit",{campground:foundCampground});
		});	
});

//UPDATE - find and update the campground and then redirect somewhere
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			console.log("redirecting...");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//DELETE - 
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,req.body.campground,function(err,deletedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			console.log("redirecting...");
			res.redirect("/campgrounds");
		}
	});

});

module.exports = router; 