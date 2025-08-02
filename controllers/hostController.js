const { compile } = require("ejs");
const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", { pageTitle: "Add home",currentUrl: req.originalUrl
,editing:false, isLoggedIn: req.isLoggedIn,
       user: req.session.user});
  // res.sendFile(path.join(rootPath,'views','addHome.html'));
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
   Home.findById(homeId).then(home=>{
    if (!home) {
      console.log("Home not found");
      return res.redirect("/host/host-home-list");
    }
    
    res.render("host/edit-home", {
      pageTitle: "Edit Your Home",
      currentUrl: req.originalUrl, 
      isLoggedIn: req.isLoggedIn,
      editing: editing,
      homeId: homeId,
      home: home,
       user: req.session.user
    });
  });

  // res.sendFile(path.join(rootPath,'views','addHome.html'));
};

exports.getHostHome = (req, res, next) => {
  Home.find().then(registeredHomes  =>{
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host home",
      currentUrl: req.originalUrl, 
      isLoggedIn: req.isLoggedIn,
       user: req.session.user
    });
  });

  // res.sendFile(path.join(rootPath,'views','addHome.html'));
};

exports.postAddHome = (req, res, next) => {
  const { houseName, number, price, location, rating, imageUrl,description} = req.body;
  const home = new Home({houseName, number, price, location, rating, imageUrl,description});
  home.save().then(()=>{
    console.log("Home saved successfully");
  });
  
  
  res.redirect("/host-home-list");
  // res.sendFile(path.join(rootPath,'views','homeAdded.html'));
};
exports.postEditHome = (req, res, next) => {
  const {id, houseName, number, price, location, rating, imageUrl,description } = req.body;
  Home.findById(id).then((home)=>{
    home.houseName=houseName;
    home.number=number;
    home.price=price;
    home.location=location;
    home.rating=rating;
    home.imageUrl=imageUrl;
    home.description=description;
    home.save().then(result=>{
      console.log("Home updated successfully",result);
    }).catch(error=>{
      console.log("Error while updating",error)
    })
    res.redirect("/host-home-list");
  }).catch(error=>{
    console.log("Error while adding home",error);
  })
  
  // res.sendFile(path.join(rootPath,'views','homeAdded.html'));
};


exports.postDeleteHome = (req, res, next) => {

   const homeId=req.params.homeId;
     console.log("Deleted this home id",homeId)
  Home.findByIdAndDelete(homeId).then(()=>{
    
    res.redirect("/host-home-list");
  }).catch(error=>{
    console.log("Error while deleting",error);
    
  })
  // res.sendFile(path.join(rootPath,'views','homeAdded.html'));
};