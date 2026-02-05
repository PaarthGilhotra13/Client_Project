const expenseApprovalModel = require("../Expense Approval/expenseApprovalModel");

const getZHDashboard = async (req, res) => {
  try {
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


// const expenseModel = require("../Expense/expenseModel");
// const expenseApprovalModel = require("../Expense Approval/expenseApprovalModel");

// const getZonalHeadDashboard = async (req, res) => {
//   try {
//     const zonalHeadId = req.user._id; // assuming auth middleware sets req.user

//     /* =========================
//        🔹 ZONAL HEAD DASHBOARD
//     ========================= */

//     // 1️⃣ Assigned Requests (for Zonal Head)
//     const assignedRequests = await expenseModel.countDocuments({
//       currentStatus: { $in: ["Pending", "Hold"] },
//       currentApproverRole: "Zonal_Head",
//     });

//     // 2️⃣ In Process (Hold by Zonal Head)
//     const inProcess = await expenseModel.countDocuments({
//       currentStatus: "Hold",
//       currentApproverRole: "Zonal_Head",
//     });

//     // 3️⃣ Approved by Zonal Head
//     const approved = await expenseApprovalModel.countDocuments({
//       approvedBy: zonalHeadId,
//       status: "Approved",
//     });

//     // 4️⃣ Rejected by Zonal Head
//     const rejected = await expenseApprovalModel.countDocuments({
//       approvedBy: zonalHeadId,
//       status: "Rejected",
//     });

//     // 5️⃣ Pending Approvals (waiting at Zonal Head level)
//     const pendingApprovals = await expenseApprovalModel.countDocuments({
//       currentApprovalLevel: "Zonal Head",
//       status: "Pending",
//     });

//     // 6️⃣ Missed Deadlines (3+ days pending at Zonal Head)
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

//     const missedDeadlines = await expenseModel.countDocuments({
//       currentStatus: "Pending",
//       currentApproverRole: "Zonal_Head",
//       createdAt: { $lte: threeDaysAgo },
//     });

//     res.send({
//       success: true,
//       status: 200,
//       message: "Zonal Head Dashboard",
//       data: {
//         assignedRequests,
//         inProcess,
//         pendingApprovals,
//         approved,
//         rejected,
//         missedDeadlines,
//       },
//     });
//   } catch (err) {
//     console.log("❌ ZONAL HEAD DASHBOARD ERROR :", err);
//     res.status(500).send({
//       success: false,
//       message: "Zonal Head Dashboard Error",
//     });
//   }
// };

// module.exports = { getZonalHeadDashboard };
