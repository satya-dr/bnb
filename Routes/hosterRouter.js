const express=require('express');
const hosterRouter=express.Router();



const hostHomeController=require('../controllers/hostController')



hosterRouter.get("/add-home",hostHomeController.getAddHome);
hosterRouter.post("/add-home",hostHomeController.postAddHome);
hosterRouter.get("/host-home-list",hostHomeController.getHostHome);
hosterRouter.get("/host/edit-home/:homeId",hostHomeController.getEditHome);
hosterRouter.post("/edit-home",hostHomeController.postEditHome);
hosterRouter.post("/delete-home/:homeId",hostHomeController.postDeleteHome);


module.exports=hosterRouter;