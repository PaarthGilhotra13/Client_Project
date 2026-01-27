const expenseModel = require("../Expense/expenseModel");
const expenseApprovalModel = require("../Expense Approval/expenseApprovalModel");

const getFMDashboard = async (req, res) => {
  try {
    // console.log("🔥 FM DASHBOARD API HIT");

    // console.log("👉 req.user :", req.user);
    // console.log("👉 req.headers.authorization :", req.headers.authorization);

    // 1️⃣ Assigned Requests
    const assignedRequests = await expenseModel.countDocuments({
      currentStatus: { $in: ["Pending", "Hold"] }
    });
    console.log("✅ assignedRequests :", assignedRequests);

    // 2️⃣ In Process
    const inProcess = await expenseModel.countDocuments({
      currentStatus: "Hold"
    });
    console.log("✅ inProcess :", inProcess);

    // 3️⃣ Approved
    const approved = await expenseModel.countDocuments({
      currentStatus: "Approved"
    });
    console.log("✅ approved :", approved);

    // 4️⃣ Rejected
    const rejected = await expenseModel.countDocuments({
      currentStatus: "Rejected"
    });
    console.log("✅ rejected :", rejected);

    // 5️⃣ Pending Approvals
    const pendingApprovals = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: "Facility Manager",
      status: "Pending"
    });
    console.log("✅ pendingApprovals :", pendingApprovals);

    // 6️⃣ Missed Deadlines
    const today = new Date();
    const missedDeadlines = await expenseModel.countDocuments({
      dueDate: { $lt: today },
      currentStatus: { $ne: "Approved" }
    });
    console.log("✅ missedDeadlines :", missedDeadlines);

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
