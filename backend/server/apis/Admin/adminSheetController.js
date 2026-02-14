const Expense = require("../Expense/expenseModel");
const { Parser } = require("json2csv");

const exportExpenseCSV = async (req, res) => {
  console.log("EXPORT CSV HIT");

  try {

    const expenses = await Expense.find()
      .sort({ createdAt: -1 })
      .populate({ path: "raisedBy", select: "name" })
      .populate({ path: "expenseHeadId", select: "name" })
      .populate({
        path: "storeId",
        select: "storeName storeCode stateId zoneId storeCategoryId cityName",
        populate: [
          { path: "stateId", select: "stateName" },
          { path: "zoneId", select: "zoneName" },
          { path: "storeCategoryId", select: "categoryName" }
        ],
      })
      .lean();

    if (!expenses.length) {
      return res.status(200).send("No expense data found");
    }

    const formatted = expenses.map((e) => ({
      timestamp: e.createdAt ? new Date(e.createdAt).toLocaleString() : "",

      submitted_by: e.raisedBy?.name || "",

      state: e.storeId?.stateId?.stateName || "",
      city: e.storeId?.cityName || "",
      store_name: e.storeId?.storeName || "",
      store_code: e.storeId?.storeCode || "",
      zone: e.storeId?.zoneId?.zoneName || "",
      store_category: e.storeId?.storeCategoryId?.categoryName || "",

      expense_head: e.expenseHeadId?.name || "",
      expense_type: e.natureOfExpense || "",
      expense_value: e.amount || "",

      remark: e.remark || "",
      rca: e.rca || "",
      policy: e.policy || "",

      approval_request: e.currentApprovalLevel || "",
      ticket_id: e.ticketId || "",

      attachment: Array.isArray(e.attachment)
        ? e.attachment.map(a => (a?.url ? a.url : a)).join(" | ")
        : e.attachment?.url || e.attachment || "",

      status: e.currentStatus || "",
      hold_remark: e.holdComment || "",

      pr: e.prismId || "",
      po: "",
    }));

    const fields = Object.keys(formatted[0]);
    const parser = new Parser({ fields });

    const csv = "\ufeff" + parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment(`expense-report-${Date.now()}.csv`);
    return res.send(csv);

  } catch (err) {
    console.error("CSV ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { exportExpenseCSV };