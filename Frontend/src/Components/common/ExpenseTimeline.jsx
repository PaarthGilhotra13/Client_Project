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

    /* ================= RESUBMISSIONS ================= */
    (expense.resubmissions || []).forEach((resub) => {
        timeline.push({
            type: "RESUBMITTED",
            attachments: normalizeToArray(resub.attachment),
            comment: resub.fmComment,
            level: resub.heldFromLevel,
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
    timeline.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    // return (
    //     <div className="col-12 mt-4">
    //         <h5 className="text-primary mb-3">Approval Timeline</h5>

    //         {timeline.map((item, index) => (
    //             <div
    //                 key={index}
    //                 className="card mb-3 shadow-sm border-0"
    //                 style={{ borderLeft: "4px solid #6776f4" }}
    //             >
    //                 <div className="card-body">

    //                     {/* ORIGINAL */}
    //                     {item.type === "ORIGINAL" && (
    //                         <>
    //                             <h6 className="text-primary mt-3">
    //                                 Expense Submitted by {item.submittedBy?.name || "-"}
    //                             </h6>

    //                             <div className="mt-3 d-flex flex-wrap gap-2">
    //                                 {normalizeToArray(item.attachments).map((file, i) => (
    //                                     <a
    //                                         key={i}
    //                                         href={fileUrl(file)}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="btn btn-sm btn-primary"
    //                                     >
    //                                         Attachment {i + 1}
    //                                     </a>
    //                                 ))}
    //                             </div>
    //                         </>
    //                     )}

    //                     {/* APPROVAL */}
    //                     {["APPROVED", "REJECTED", "HOLD", "CLOSED"].includes(item.type) && (
    //                         <>
    //                             <h6 className="mt-3">{item.level} {item.type}</h6>

    //                             <p><strong>Comment:</strong> {item.comment || "-"}</p>

    //                             <div className="d-flex flex-wrap gap-2">
    //                                 {normalizeToArray(item.prAttachments).map((file, i) => (
    //                                     <a
    //                                         key={i}
    //                                         href={fileUrl(file)}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="btn btn-sm btn-info"
    //                                     >
    //                                         PR Attachment {i + 1}
    //                                     </a>
    //                                 ))}

    //                                 {normalizeToArray(item.poAttachments).map((file, i) => (
    //                                     <a
    //                                         key={i}
    //                                         href={fileUrl(file)}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="btn btn-sm btn-secondary"
    //                                     >
    //                                         PO Attachment {i + 1}
    //                                     </a>
    //                                 ))}
    //                             </div>
    //                         </>
    //                     )}

    //                     {/* RESUBMITTED */}
    //                     {item.type === "RESUBMITTED" && (
    //                         <>
    //                             <h6 className="text-warning mt-3">
    //                                 {item.level} RESUBMITTED
    //                             </h6>

    //                             <p><strong>Comment:</strong> {item.comment || "-"}</p>

    //                             <div className="d-flex flex-wrap gap-2">
    //                                 {normalizeToArray(item.attachments).map((file, i) => (
    //                                     <a
    //                                         key={i}
    //                                         href={fileUrl(file)}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="btn btn-sm btn-warning"
    //                                     >
    //                                         Resubmitted {i + 1}
    //                                     </a>
    //                                 ))}
    //                             </div>
    //                         </>
    //                     )}

    //                     {/* EXECUTION */}
    //                     {item.type === "EXECUTION" && (
    //                         <>
    //                             <h6 className="text-info mt-3">
    //                                 FM Uploaded Execution Documents
    //                             </h6>

    //                             <div className="d-flex flex-wrap gap-2">
    //                                 {normalizeToArray(item.wcr).map((file, i) => (
    //                                     <a
    //                                         key={i}
    //                                         href={fileUrl(file)}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="btn btn-sm btn-info"
    //                                     >
    //                                         WCR {i + 1}
    //                                     </a>
    //                                 ))}

    //                                 {normalizeToArray(item.invoice).map((file, i) => (
    //                                     <a
    //                                         key={i}
    //                                         href={fileUrl(file)}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="btn btn-sm btn-secondary"
    //                                     >
    //                                         Invoice {i + 1}
    //                                     </a>
    //                                 ))}
    //                             </div>
    //                         </>
    //                     )}

    //                     <div className="text-muted mt-3" style={{ fontSize: "12px" }}>
    //                         {new Date(item.date).toLocaleString()}
    //                     </div>
    //                 </div>
    //             </div>
    //         ))}
    //     </div>
    // );
    return (
        <div className="col-12 mt-4 d-flex flex-column" style={{ gap: "4px" }}>
            <h5 className="text-primary mb-3">Approval Timeline</h5>

            {timeline.map((item, index) => {

                const getColor = () => {
                    if (item.type === "ORIGINAL") return "#007bff"; // Blue
                    if (item.type === "APPROVED") return "#28a745"; // Green
                    if (item.type === "REJECTED") return "#dc3545"; // Red
                    if (item.type === "HOLD") return "#6c757d";     // Grey
                    if (item.type === "RESUBMITTED") {
                        return item.level?.toUpperCase().includes("HOLD")
                            ? "#800000"   // Maroon
                            : "#ffb347";  // Light Orange
                    }
                    return "#6776f4";
                };

                const borderColor = getColor();

                return (
                    <div
                        key={index}
                        style={{
                            position: "relative",
                            marginBottom: 0,
                            padding: 0
                        }}
                    >

                        {/* LEFT STRIP */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "4px",
                                backgroundColor: borderColor,
                                borderRadius: "6px 0 0 6px"
                            }}
                        />

                        <div
                            className="card border-0 mb-0"
                            style={{
                                marginLeft: "4px",
                                background: "#fff",
                                boxShadow: "none",
                                borderRadius: "6px"
                            }}
                        >

                            <div className="card-body py-2">

                                {/* ================= HEADER ROW ================= */}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 style={{ color: borderColor, marginBottom: 0 }}>
                                        {item.type === "ORIGINAL" && `Expense Submitted by ${item.submittedBy?.name || "-"}`}
                                        {["APPROVED", "REJECTED", "HOLD", "CLOSED"].includes(item.type) && `${item.level} ${item.type}`}
                                        {item.type === "RESUBMITTED" && `${item.level} RESUBMITTED`}
                                        {item.type === "EXECUTION" && "FM Uploaded Execution Documents"}
                                    </h6>

                                    <span style={{ fontSize: "12px", color: "#777" }}>
                                        {new Date(item.date).toLocaleString()}
                                    </span>
                                </div>

                                {/* ================= CONTENT ROW ================= */}
                                {(item.comment ||
                                    normalizeToArray(item.attachments).length > 0 ||
                                    normalizeToArray(item.prAttachments).length > 0 ||
                                    normalizeToArray(item.poAttachments).length > 0 ||
                                    normalizeToArray(item.wcr).length > 0 ||
                                    normalizeToArray(item.invoice).length > 0) && (

                                        <div className="d-flex justify-content-between align-items-start flex-wrap">

                                            {/* LEFT SIDE → COMMENT */}
                                            <div>
                                                {item.comment && (
                                                    <div>
                                                        <strong>Comment:</strong> {item.comment}
                                                    </div>
                                                )}
                                            </div>

                                            {/* RIGHT SIDE → ATTACHMENTS */}
                                            <div className="mt-2 mt-md-0 d-flex flex-wrap gap-0">

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
                                                            textDecoration: "none"
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
                                                            textDecoration: "none"
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
                                                            textDecoration: "none"
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
                                                            textDecoration: "none"
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
                                                            textDecoration: "none"
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

