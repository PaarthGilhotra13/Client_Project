import ExpenseTimeline from "./ExpenseTimeline";

export default function ExpenseDetails({
    show,
    onClose,
    expense,
    approvalHistory,
    onApprove,
    onHold,
    onReject,
}) {
    if (!show || !expense) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    {/* ================= HEADER ================= */}
                    <div className="modal-header">
                        <h5 className="modal-title">Expense Details</h5>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                width: "30px",
                                height: "30px",
                                backgroundColor: "red",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* ================= BODY ================= */}
                    <div className="modal-body px-4">
                        <div className="p-4 mb-4 rounded shadow-sm bg-light border">
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
                                    <span className="badge bg-warning text-dark px-3 py-2">
                                        {expense.currentStatus}
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
                        </div>



                    </div>

                    {/* ================= FOOTER BUTTONS ================= */}
                    {(expense.currentStatus === "Pending" ||
                        expense.currentStatus === "Hold") && (
                            <div className="modal-footer">

                                <button
                                    className="btn btn-success"
                                    onClick={onApprove}
                                >
                                    Approve
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={onHold}
                                >
                                    Hold
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={onReject}
                                >
                                    Reject
                                </button>

                            </div>
                        )}

                </div>
            </div>
        </div>
    );
}