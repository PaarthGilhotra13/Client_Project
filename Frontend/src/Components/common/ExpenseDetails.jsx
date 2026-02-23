import ExpenseTimeline from "./ExpenseTimeline";

export default function ExpenseDetails({
    show,
    onClose,
    expense,
    approvalHistory,
    page,
    onHold,
    onReject,
}) {
    if (!show || !expense) return null;
    const status = page || "-";
    return (
        <>
            <div className="row g-3">

                <div className="text-muted ">
                    Requested By :
                    <span className="fw-semibold text-success ms-1">
                        {expense.raisedBy?.name || "-"}
                        {" "}
                        ({expense.raisedBy?.designation || "-"})
                    </span>
                </div>

                {/* LEFT COLUMN */}
                <div className="col-md-5">
                    <div className="text-muted small">Ticket ID</div>
                    <div className="fw-semibold">{expense.ticketId}</div>
                </div>

                {/* RIGHT COLUMN (Shifted Right) */}
                <div className="col-md-5 offset-md-2">
                    <div className="text-muted small">Store:</div>
                    <div className="fw-semibold">
                        {expense.storeId?.storeName}
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="text-muted small">Expense Head:</div>
                    <div className="fw-semibold">
                        {expense.expenseHeadId?.name}
                    </div>
                </div>

                <div className="col-md-5 offset-md-2">
                    <div className="text-muted small">Amount:</div>
                    <div className="fw-semibold">
                        ₹ {expense.amount}
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="text-muted small">Policy:</div>
                    <div className="fw-semibold">
                        {expense.policy || "-"}
                    </div>
                </div>

                <div className="col-md-5 offset-md-2">
                    <div className="text-muted small">Nature of Expense:</div>
                    <div className="fw-semibold">
                        {expense.natureOfExpense || "-"}
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="text-muted small">RCA:</div>
                    <div className="fw-semibold">
                        {expense.rca || "-"}
                    </div>
                </div>

                <div className="col-md-5 offset-md-2">
                    <div className="text-muted small">Remarks:</div>
                    <div className="fw-semibold">
                        {expense.remark || "-"}
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="text-muted small">Status</div>

                    <span
                        className={`badge px-3 py-2 ${status === "Approved"
                                ? "bg-success"
                                : status === "Rejected"
                                    ? "bg-danger"
                                    : status === "Hold" || status === "Pending"
                                        ? "bg-warning text-dark"
                                        : status === "Closed"
                                            ? "bg-secondary"
                                            : "bg-secondary"
                            }`}
                    >
                        {status}
                    </span>
                </div>

                <div className="col-md-5 offset-md-2">
                    <div className="text-muted small">Created At:</div>
                    <div className="fw-semibold">
                        {new Date(expense.createdAt).toLocaleDateString()}
                    </div>
                </div>
                {/* ================= TIMELINE ================= */}
                <ExpenseTimeline
                    expense={expense}
                    approvalHistory={approvalHistory}
                />
            </div>
        </>
    )
}