const expenseApprovalModel = require("../Expense Approval/expenseApprovalModel");

const getZHDashboard = async (req, res) => {
  try {
    console.log("🔥 ZONAL HEAD DASHBOARD API HIT");

    const ZH_LEVEL = "Zonal Head";

    /* ================= TOTAL REQUESTS ================= */
    const totalRequests = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: ZH_LEVEL
    });

    /* ================= PENDING ================= */
    const pending = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: ZH_LEVEL,
      status: "Pending"
    });

    /* ================= APPROVED ================= */
    const approved = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: ZH_LEVEL,
      status: "Approved"
    });

    /* ================= REJECTED ================= */
    const rejected = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: ZH_LEVEL,
      status: "Rejected"
    });

    /* ================= HOLD ================= */
    const hold = await expenseApprovalModel.countDocuments({
      currentApprovalLevel: ZH_LEVEL,
      status: "Hold"
    });

    /* ================= RESPONSE ================= */
    res.send({
      success: true,
      status: 200,
      message: "Zonal Head Dashboard",
      data: {
        totalRequests,
        pending,
        approved,
        rejected,
        hold
      }
    });

  } catch (err) {
    console.log("❌ ZH DASHBOARD ERROR :", err);
    res.status(500).send({
      success: false,
      message: "Zonal Head Dashboard Error"
    });
  }
};

module.exports = { getZHDashboard };
