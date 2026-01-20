const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    storeId: [{ type: mongoose.Schema.Types.ObjectId, ref: "storeData" }],
    userType: { type: Number, default: "" }, //1- Admin, 2- Employee, 3- FM, 4- CLM, 5- Zonal Head, 6- Business Finance,  7- Procurement
    designation: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
})

module.exports = new mongoose.model("userData", userSchema)