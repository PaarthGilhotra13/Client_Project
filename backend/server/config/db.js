// const mongoose=require("mongoose")

// mongoose.connect("mongodb+srv://priyanshugarg6602:KnG4xoZGDNFL8u0G@cluster0.ocizwmr.mongodb.net/R&M_Tool_DB")
// .then(()=>{
//     console.log("Database is Connected Successfully");
// })
// .catch((err)=>{
//     console.log("Database is not Connected ",err);
// })

const mongoose = require("mongoose");

// 1️⃣ PRIMARY DB (Atlas) – APP YAHIN SE CHALEGI
mongoose.connect(
  "mongodb+srv://priyanshugarg6602:KnG4xoZGDNFL8u0G@cluster0.ocizwmr.mongodb.net/R&M_Tool_DB"
)
.then(() => console.log("Primary DB Connected (Atlas)"))
.catch(err => console.log("Primary DB Error", err));

// 2️⃣ BACKUP DB (Local) – SIRF BACKUP KE LIYE
const backupDB = mongoose.createConnection(
  "mongodb://localhost:27017/R&M_Tool_DB"
);

backupDB.on("connected", () => {
  console.log("Backup DB Connected (Local)");
});

backupDB.on("error", err => {
  console.log("Backup DB Error", err);
});

module.exports = { mongoose, backupDB };
