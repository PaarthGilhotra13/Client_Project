const Base_URL = "http://localhost:3000/";

const normalizeToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return [value];
    return [];
};

export default function ExpenseTimeline({ expense, approvalHistory }) {
    if (!expense) return null;

    const timeline = [];

    const fileUrl = (path) => (path ? Base_URL + path : null);

    /* ================= ORIGINAL ================= */
    const originalAttachments = normalizeToArray(expense.attachment);

    if (originalAttachments.length > 0) {
        timeline.push({
            type: "ORIGINAL",
            attachments: originalAttachments,
            submittedBy: expense?.raisedBy,
            date: expense.createdAt,
        });
    }

    /* ================= APPROVAL HISTORY ================= */
    (approvalHistory || []).forEach((item) => {
        const actionType = item.action?.toUpperCase();

        // 🔥 Ignore accidental RESUBMITTED in approvalHistory
        if (actionType === "RESUBMITTED") return;

        const normalizedLevel =
            item.level?.replace(/\s+/g, "").toUpperCase();

        const isPrPoApproved =
            normalizedLevel === "PR/PO" && actionType === "APPROVED";

        timeline.push({
            type: actionType,
            level: item.level,
            comment: item.comment,
            approver: item?.approverId,
            prAttachments: isPrPoApproved
                ? normalizeToArray(expense.prAttachment)
                : [],
            poAttachments: isPrPoApproved
                ? normalizeToArray(expense.poAttachment)
                : [],
            date: item.actionAt,
        });
    });

    /* ================= RESUBMISSIONS (Only From Expense) ================= */
    const resubmissions = Array.isArray(expense.resubmissions)
        ? expense.resubmissions
        : [];

    resubmissions.forEach((resub) => {
        timeline.push({
            type: "RESUBMITTED",
            attachments: normalizeToArray(resub.attachment),
            comment: resub.fmComment,
            level: "FM",
            date: resub.submittedAt,
        });
    });

    /* ================= EXECUTION ================= */
    const wcrFiles = normalizeToArray(expense.wcrAttachment);
    const invoiceFiles = normalizeToArray(expense.invoiceAttachment);

    if (wcrFiles.length > 0 || invoiceFiles.length > 0) {
        timeline.push({
            type: "EXECUTION",
            wcr: wcrFiles,
            invoice: invoiceFiles,
            date: expense.executionUploadedAt || expense.updatedAt,
        });
    }

    /* ================= SORT ================= */
    timeline.sort(
        (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
    );

    return (
        <div className="col-12 mt-4 d-flex flex-column" style={{ gap: "4px" }}>
            <h5 className="text-primary mb-3">Approval Timeline</h5>

            {timeline.map((item, index) => {
                const getColor = () => {
                    if (item.type === "ORIGINAL") return "#007bff";
                    if (item.type === "APPROVED") return "#28a745";
                    if (item.type === "REJECTED") return "#dc3545";
                    if (item.type === "HOLD") return "#6c757d";
                    if (item.type === "RESUBMITTED") return "#ffb347";
                    return "#6776f4";
                };

                const borderColor = getColor();

                return (
                    <div
                        key={index}
                        style={{ position: "relative", marginBottom: 0, padding: 0 }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "4px",
                                backgroundColor: borderColor,
                                borderRadius: "6px 0 0 6px",
                            }}
                        />

                        <div
                            className="card border-0 mb-0"
                            style={{
                                marginLeft: "4px",
                                background: "#fff",
                                boxShadow: "none",
                                borderRadius: "6px",
                            }}
                        >
                            <div className="card-body py-2">

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 style={{ color: borderColor, marginBottom: 0 }}>
                                        {item.type === "ORIGINAL" &&
                                            `Expense Submitted by ${item.submittedBy?.name || "-"}`}
                                        {["APPROVED", "REJECTED", "HOLD", "CLOSED"].includes(item.type) &&
                                            `${item.level} ${item.type}`}
                                        {item.type === "RESUBMITTED" && "FM RESUBMITTED"}
                                        {item.type === "EXECUTION" &&
                                            "FM Uploaded Execution Documents"}
                                    </h6>

                                    <span style={{ fontSize: "12px", color: "#777" }}>
                                        {new Date(item.date).toLocaleString()}
                                    </span>
                                </div>

                                {(item.comment ||
                                    normalizeToArray(item.attachments).length > 0 ||
                                    normalizeToArray(item.prAttachments).length > 0 ||
                                    normalizeToArray(item.poAttachments).length > 0 ||
                                    normalizeToArray(item.wcr).length > 0 ||
                                    normalizeToArray(item.invoice).length > 0) && (
                                        <div className="d-flex justify-content-between align-items-start flex-wrap">
                                            <div>
                                                {item.comment && (
                                                    <div>
                                                        <strong>Comment:</strong> {item.comment}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-2 mt-md-0 d-flex flex-wrap gap-1">
                                                {normalizeToArray(item.attachments).map((file, i) => (
                                                    <a
                                                        key={i}
                                                        href={fileUrl(file)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            background: borderColor,
                                                            color: "#fff",
                                                            padding: "5px 12px",
                                                            fontSize: "13px",
                                                            borderRadius: "4px",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        Attachment {i + 1}
                                                    </a>
                                                ))}

                                                {normalizeToArray(item.prAttachments).map((file, i) => (
                                                    <a
                                                        key={i}
                                                        href={fileUrl(file)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            background: borderColor,
                                                            color: "#fff",
                                                            padding: "5px 12px",
                                                            fontSize: "13px",
                                                            borderRadius: "4px",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        PR Attachment {i + 1}
                                                    </a>
                                                ))}

                                                {normalizeToArray(item.poAttachments).map((file, i) => (
                                                    <a
                                                        key={i}
                                                        href={fileUrl(file)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            background: borderColor,
                                                            color: "#fff",
                                                            padding: "5px 12px",
                                                            fontSize: "13px",
                                                            borderRadius: "4px",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        PO Attachment {i + 1}
                                                    </a>
                                                ))}

                                                {normalizeToArray(item.wcr).map((file, i) => (
                                                    <a
                                                        key={i}
                                                        href={fileUrl(file)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            background: borderColor,
                                                            color: "#fff",
                                                            padding: "5px 12px",
                                                            fontSize: "13px",
                                                            borderRadius: "4px",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        WCR {i + 1}
                                                    </a>
                                                ))}

                                                {normalizeToArray(item.invoice).map((file, i) => (
                                                    <a
                                                        key={i}
                                                        href={fileUrl(file)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            background: borderColor,
                                                            color: "#fff",
                                                            padding: "5px 12px",
                                                            fontSize: "13px",
                                                            borderRadius: "4px",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        Invoice {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}