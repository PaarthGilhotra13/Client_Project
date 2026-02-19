const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://priyanshugarg6602:KnG4xoZGDNFL8u0G@cluster0.ocizwmr.mongodb.net/R&M_Tool_DB")
.then(()=>{
    console.log("Database is Connected Successfully");
})
.catch((err)=>{
    console.log("Database is not Connected ",err);
})