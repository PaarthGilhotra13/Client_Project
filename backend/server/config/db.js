const mongoose=require("mongoose")

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database is Connected Successfully");
})
.catch((err)=>{
    console.log("Database is not Connected ",err);
})