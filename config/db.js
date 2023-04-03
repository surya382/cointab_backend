const mongoose=require("mongoose");

const connection=mongoose.connect("mongodb+srv://rahul:rahul@cluster0.iesgmef.mongodb.net/cointab?retryWrites=true&w=majority")

module.exports={connection};