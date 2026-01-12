const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    contact: { type: String, default: "" },
    empcode: { type: String, unique: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "storeData" },
    userId: { type: String, default: "" },
    designation: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
})

module.exports = new mongoose.model("employee", employeeSchema)


