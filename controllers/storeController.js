
const Home = require("../models/home");
const User=require('../models/user')


exports.getIndex = (req, res, next) => {
  console.log("Is logged in",req.session)
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Home Page",
      currentUrl: req.originalUrl,isLoggedIn: req.isLoggedIn,
       user: req.session.user
    });
  });
};
exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentUrl: req.originalUrl, 
      isLoggedIn: req.isLoggedIn,
       user: req.session.user


    });
  });
};

exports.getBookings =async(req, res, next) => {
  const userId= req.session.user._id
  const user=await User.findById(userId).populate('bookings');

  // console.log("user1",user)
//  const favouriteHomes = favourites.map((fav) => fav.houseId);

      res.render("store/bookings", {
        BookingHomes: user.bookings,
        pageTitle: "Bookings ",
        currentUrl: req.originalUrl, 
        isLoggedIn: req.isLoggedIn,
       user: req.session.user

      });
};
exports.getFavourite = async(req, res, next) => {
  const userId= req.session.user._id
  const user=await User.findById(userId).populate('favourites');

  // console.log("user1",user)
//  const favouriteHomes = favourites.map((fav) => fav.houseId);

      res.render("store/favourite-list", {
        favouriteHomes: user.favourites,
        pageTitle: "Favourite List",
        currentUrl: req.originalUrl, 
        isLoggedIn: req.isLoggedIn,
       user: req.session.user

      });
};

exports.postAddToFavourite =async (req, res, next) => {
  const homeId = req.body.id;
  const userId= req.session.user._id;
  const user =await User.findById(userId)
  if(!user.favourites.includes(homeId)){

    user.favourites.push(homeId) 
    await user.save();
  }
      res.redirect("/favourite-list");
};
exports.postRemoveFromFavourite =async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId= req.session.user._id;
  const user =await User.findById(userId)
    if(user.favourites.includes(homeId)){
      user.favourites=user.favourites.filter(fav=>fav!=homeId);
      await user.save();
    }
     res.redirect("/favourite-list");
};
exports.postAddToBookings =async (req, res, next) => {
  const homeId = req.body.id;
  const userId= req.session.user._id;
  const user =await User.findById(userId)
  if(!user.bookings.includes(homeId)){

    user.bookings.push(homeId) 
    await user.save();
  }
      res.redirect("/booking");

};
exports.postRemoveFromBooking =
async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId= req.session.user._id;
  const user =await User.findById(userId)
    if(user.bookings.includes(homeId)){
      user.bookings=user.bookings.filter(fav=>fav!=homeId);
      await user.save();
    }
     res.redirect("/booking");




};
exports.getHomesDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/home-list");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home details",
        currentUrl: req.originalUrl,
        isLoggedIn: req.isLoggedIn,
       user: req.session.user

      });
    }
  });
};
