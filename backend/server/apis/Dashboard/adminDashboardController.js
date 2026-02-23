const expenseModel = require("../Expense/expenseModel");
const userModel = require("../User/userModel");

const getDashboard = async (req, res) => {
  try {
    /* =========================
       🔹 DATE CALCULATIONS
    ========================= */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    /* =========================
       🔹 EXPENSE STATS (MATCHES LIST PAGES)
    ========================= */
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      declinedRequests,
      inProcessRequests,
      todayRequests,
      missingBridgeRequests
    ] = await Promise.all([
      expenseModel.countDocuments(),

      expenseModel.countDocuments({ currentStatus: "Pending" }),

      expenseModel.countDocuments({ currentStatus: "Approved" }),

      // 🔥 SAME STATUS AS REJECTED / DECLINED PAGE
      expenseModel.countDocuments({ currentStatus: "Declined" }),

      expenseModel.countDocuments({ currentStatus: "Hold" }),

      expenseModel.countDocuments({
        createdAt: { $gte: todayStart }
      }),

      // 🔥 Missing Bridge = Pending for 3+ days
      expenseModel.countDocuments({
        currentStatus: "Pending",
        createdAt: { $lte: threeDaysAgo }
      })
    ]);

    /* =========================
       🔹 USER / DESIGNATION STATS (NO NAMING CHANGE)
    ========================= */
    const [
      totalUsers,
      totalFacilityManagers,
      totalCLMs,
      totalZonalHeads,
      totalBusinessFinance,
      totalProcurement,
      totalPrPo,
      totalZonalCommercial,
      totalMissingBridgeUsers
    ] = await Promise.all([
      userModel.countDocuments({ status: true }),

      userModel.countDocuments({ designation: "FM", status: true }),
      userModel.countDocuments({ designation: "CLM", status: true }),
      userModel.countDocuments({ designation: "Zonal_Head", status: true }),

      userModel.countDocuments({ designation: "Business_Finance", status: true }),
      userModel.countDocuments({ designation: "Procurement", status: true }),
      userModel.countDocuments({ designation: "PR/PO", status: true }),
      userModel.countDocuments({ designation: "Zonal_Commercial", status: true }),
      userModel.countDocuments({ designation: "Missing_Bridge", status: true })
    ]);

    /* =========================
       🔹 RESPONSE (FRONTEND SAFE KEYS)
    ========================= */
    res.status(200).send({
      success: true,
      message: "Admin Dashboard",
      data: {
        // 🔹 Expense cards
        totalRequests,
        pendingRequests,
        approvedRequests,

        // 🔥 frontend expects rejectedRequests
        rejectedRequests: declinedRequests,

        inProcessRequests,
        todayRequests,
        missingBridgeRequests,

        // 🔹 User / Role cards
        totalUsers,
        totalFacilityManagers,
        totalCLMs,
        totalZonalHeads,

        totalBusinessFinance,
        totalProcurement,
        totalPrPo,
        totalZonalCommercial,
        totalMissingBridgeUsers
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send({
      success: false,
      message: "Dashboard Error"
    });
  }
};

module.exports = { getDashboard };
