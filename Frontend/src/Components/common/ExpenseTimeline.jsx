export default function ExpenseTimeline({ expense, approvalHistory }) {
    if (!expense) return null;

    const timeline = [];

    /* ================= ORIGINAL ================= */
    if (expense.attachment) {
        timeline.push({
            type: "ORIGINAL",
            attachment: expense.attachment,
            date: expense.createdAt,
        });
    }

    /* ================= APPROVAL HISTORY (SINGLE LOOP) ================= */
    (approvalHistory || []).forEach((item) => {

        const actionType = item.action?.toUpperCase();

        if (actionType === "RESUBMITTED") {

            // Find matching resubmission (latest one)
            const lastResubmission =
                expense.resubmissions?.[expense.resubmissions.length - 1];

            timeline.push({
                type: "RESUBMITTED",
                level: item.level,
                comment: item.comment,
                attachment: lastResubmission?.attachment,
                date: item.actionAt,
            });

        } else {

            timeline.push({
                type: actionType,
                level: item.level,
                comment: item.comment,
                date: item.actionAt,
            });

        }
    });

    /* ================= EXECUTION ================= */
    if (expense.wcrAttachment || expense.invoiceAttachment) {
        timeline.push({
            type: "EXECUTION",
            wcr: expense.wcrAttachment,
            invoice: expense.invoiceAttachment,
            date: expense.executionUploadedAt || expense.updatedAt,
        });
    }

    timeline.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    return (
        <div className="col-12 mt-4">
            <h5 className="text-primary">Approval Timeline</h5>

            {timeline.map((item, index) => (
                <div
                    key={index}
                    className={`p-3 mb-3 rounded shadow-sm ${item.type === "HOLD"
                        ? "bg-light border-start border-danger border-4"
                        : item.type === "APPROVED"
                            ? "bg-white border-start border-success border-4"
                            : item.type === "REJECTED"
                                ? "bg-light border-start border-danger border-4"
                                : item.type === "CLOSED"
                                    ? "bg-light border-start border-secondary border-4"
                                    : item.type === "EXECUTION"
                                        ? "bg-white border-start border-info border-4"
                                        : item.type === "RESUBMITTED"
                                            ? "bg-light border-start border-warning border-4"
                                            : "bg-white border-start border-primary border-4"
                        }`}
                >
                    {/* ORIGINAL */}
                    {item.type === "ORIGINAL" && (
                        <>
                            <h6 className="text-primary mb-2">
                                Original Expense Submitted
                            </h6>
                            <a
                                href={item.attachment}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-primary"
                            >
                                View Original Attachment
                            </a>
                        </>
                    )}

                    {/* HOLD */}
                    {item.type === "HOLD" && (
                        <>
                            <h6 className="text-danger mb-2">
                                {item.level} HOLD
                            </h6>
                            <p>
                                <strong>Comment:</strong> {item.comment || "-"}
                            </p>
                        </>
                    )}

                    {/* RESUBMITTED */}
                    {item.type === "RESUBMITTED" && (
                        <>
                            <h6 className="text-warning mb-2">
                                {item.level} RESUBMITTED
                            </h6>
                            <p>
                                <strong>Comment:</strong> {item.comment || "-"}
                            </p>

                            {item.attachment && (
                                <a
                                    href={item.attachment}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-warning text-dark"
                                >
                                    View Resubmitted Attachment
                                </a>
                            )}
                        </>
                    )}

                    {/* APPROVED / REJECTED / CLOSED */}
                    {["APPROVED", "REJECTED", "CLOSED"].includes(item.type) && (
                        <>
                            <h6
                                className={`mb-2 ${item.type === "APPROVED"
                                    ? "text-success"
                                    : item.type === "CLOSED"
                                        ? "text-secondary"
                                        : "text-danger"
                                    }`}
                            >
                                {item.level} {item.type}
                            </h6>
                            <p>
                                <strong>
                                    {item.type === "CLOSED" && item.level === "PR/PO"
                                        ? "Email Subject:"
                                        : item.type === "CLOSED" && item.level === "ZONAL_COMMERCIAL"
                                            ? "Prism ID:"
                                            : "Comment:"}
                                </strong>{" "}
                                {item.comment || "-"}
                            </p>

                        </>
                    )}

                    {/* EXECUTION */}
                    {item.type === "EXECUTION" && (
                        <>
                            <h6 className="text-info mb-2">
                                FM Uploaded Execution Documents
                            </h6>

                            {item.wcr && (
                                <a
                                    href={item.wcr}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-info me-2"
                                >
                                    WCR
                                </a>
                            )}

                            {item.invoice && (
                                <a
                                    href={item.invoice}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-secondary"
                                >
                                    Invoice
                                </a>
                            )}
                        </>
                    )}

                    {/* DATE */}
                    <div className="text-muted mt-2" style={{ fontSize: "12px" }}>
                        {new Date(item.date).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

