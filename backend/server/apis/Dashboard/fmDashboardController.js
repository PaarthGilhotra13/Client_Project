const expenseModel = require("../Expense/expenseModel");
const expenseApprovalModel = require("../Expense Approval/expenseApprovalModel");

const getFMDashboard = async (req, res) => {
  try {
    // 1️⃣ Assigned Requests
    const assignedRequests = await expenseModel.countDocuments({
      currentStatus: { $in: ["Pending", "Hold"] }
    });

    // 2️⃣ In Process
    const inProcess = await expenseModel.countDocuments  ({
      currentStatus: "Hold"
    });
    // 3️⃣ Approved
    const approved = await expenseModel.countDocuments({
      currentStatus: "Approved",
    });

    // 4️⃣ Rejected
    const rejected = await expenseModel.countDocuments({
      currentStatus: "Rejected"
    });

    // 5️⃣ Pending Approvals
    const pendingApprovals = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: "Facility Manager",
      status: "Pending"
    });

    // 6️⃣ Missed Deadlines
    const today = new Date();
    const missedDeadlines = await expenseModel.countDocuments({
      dueDate: { $lt: today },
      currentStatus: { $ne: "Approved" }
    });

    res.send({
      success: true,
      status: 200,
      message: "FM Dashboard",
      data: {
        assignedRequests,
        inProcess,
        pendingApprovals,
        approved,
        rejected,
        missedDeadlines
      }
    });

  } catch (err) {
    console.log("❌ FM DASHBOARD ERROR :", err);
    res.status(500).send({
      success: false,
      message: "FM Dashboard Error"
    });
  }
};

module.exports = { getFMDashboard };
