
const mongoose=require('mongoose');
// const Favourite=require('./favourites');
const Booking=require('./bookings')
const homeSchema=  mongoose.Schema({
  houseName:{
    type:String,
    required:true
  },
   number:{
    type:Number,
    required:true
  },
   price:{
    type:Number,
    required:true
  },
   location:{
    type:String,
    required:true
  },
   rating:{
    type:Number,
    required:true
  },
   imageUrl:{
    type:String
   
  },
   description:{
    type:String
   
  }
})

// homeSchema.pre('findOneAndDelete', async function (next) {
//   const homeId=this.getQuery()["_id"];
//   await Favourite.deleteMany({houseId:homeId});
//   await Booking.deleteMany({houseId:homeId});
//   next();
// })

module.exports=mongoose.model('Home',homeSchema)