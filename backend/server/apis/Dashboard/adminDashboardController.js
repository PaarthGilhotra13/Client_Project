const expenseModel = require("../Expense/expenseModel");
const userModel = require("../User/userModel");

const getDashboard = async (req, res) => {
  try {

    /* =========================
       🔹 EXPENSE STATS (same)
    ========================= */

    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      inProcessRequests,
      todayRequests
    ] = await Promise.all([
      expenseModel.countDocuments(),
      expenseModel.countDocuments({ currentStatus: "Pending" }),
      expenseModel.countDocuments({ currentStatus: "Approved" }),
      expenseModel.countDocuments({ currentStatus: "Rejected" }),
      expenseModel.countDocuments({ currentStatus: "Hold" }),
      expenseModel.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    /* =========================
       🔹 USER / DESIGNATION STATS (FIXED)
    ========================= */

    const [
      totalUsers,
      totalFacilityManagers,
      totalCLMs,
      totalZonalHeads
    ] = await Promise.all([
      userModel.countDocuments({ status: true }),

      // 🔥 EXACT MATCH WITH DB
      userModel.countDocuments({ designation: "FM", status: true }),
      userModel.countDocuments({ designation: "CLM", status: true }),
      userModel.countDocuments({ designation: "Zonal_Head", status: true })
    ]);

    res.send({
      success: true,
      status: 200,
      message: "Admin Dashboard",
      data: {
        // 🔹 Expense cards
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        inProcessRequests,
        todayRequests,

        // 🔹 User cards (NOW CORRECT)
        totalUsers,
        totalFacilityManagers,
        totalCLMs,
        totalZonalHeads
      }
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dashboard Error"
    });
  }
};

module.exports = { getDashboard };
