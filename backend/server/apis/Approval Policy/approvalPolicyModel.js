const mongoose=require("mongoose")

const approvalPolicySchema = new mongoose.Schema({
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  approvalLevels: [{ type: String, required: true }],
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});


module.exports=new mongoose.model("approvalPolicyData",approvalPolicySchema)