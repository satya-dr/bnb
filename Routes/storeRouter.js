
const express=require('express');
const storeRouter=express.Router();


const storeController=require('../controllers/storeController')




storeRouter.get("/",storeController.getIndex);
storeRouter.get("/home-list",storeController.getHomes);
storeRouter.get("/favourite-list",storeController.getFavourite);
storeRouter.get("/booking",storeController.getBookings);

storeRouter.get("/home-list/:homeId",storeController.getHomesDetails);
storeRouter.post("/favourites",storeController.postAddToFavourite);
storeRouter.post("/bookings",storeController.postAddToBookings);
storeRouter.post("/favourites/delete/:homeId",storeController.postRemoveFromFavourite);
storeRouter.post("/bookings/delete/:homeId",storeController.postRemoveFromBooking);





module.exports=storeRouter;
