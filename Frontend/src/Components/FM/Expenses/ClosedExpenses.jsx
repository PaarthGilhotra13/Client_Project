// Closed Tickets (FM)
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function ClosedTickets() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [approvalHistory, setApprovalHistory] = useState([]);

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        ApiServices.MyExpenses({
            userId,
            currentStatus: "Closed",
        })
            .then((res) => {
                setData(res?.data?.success ? res.data.data || [] : []);
                setLoad(false);
            })
            .catch(() => {
                setData([]);
                setLoad(false);
            });
    }, []);

    const handleViewClick = (expense) => {
        setSelectedExpense(expense);
        setShowModal(true);

        ApiServices.ExpenseHistory({ expenseId: expense._id })
            .then(res => {
                setApprovalHistory(res?.data?.data || []);
            })
            .catch(() => {
                setApprovalHistory([]);
            });
    };


    const handleCloseModal = () => {
        setSelectedExpense(null);
        console.log(selectedExpense.createdAt)
        console.log(selectedExpense.updatedAt)
        setShowModal(false);
    };
    const buildTimeline = (expense) => {
        if (!expense) return [];

        const timeline = [];

        // ORIGINAL
        if (expense.attachment) {
            timeline.push({
                type: "ORIGINAL",
                attachment: expense.attachment,
                date: expense.createdAt,
            });
        }

        // APPROVAL HISTORY
        (approvalHistory || []).forEach(item => {
            timeline.push({
                type: item.action?.toUpperCase(),
                level: item.level,
                comment: item.comment,
                date: item.actionAt,
            });
        });

        // EXECUTION
        if (expense.wcrAttachment || expense.invoiceAttachment) {
            timeline.push({
                type: "EXECUTION",
                wcr: expense.wcrAttachment,
                invoice: expense.invoiceAttachment,
                date: expense.executionUploadedAt || expense.updatedAt || expense.createdAt,
            });
        }

        timeline.sort((a, b) =>
            new Date(a.date || 0) - new Date(b.date || 0)
        );

        return timeline;
    };


    return (
        <main className="main" id="main">
            <PageTitle child="Closed Tickets" />

            {load ? (
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                />
            ) : (
                <div className="container-fluid mt-4 table-responsive">
                    <table className="table table-hover table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Ticket ID</th>
                                <th>Store</th>
                                <th>Expense Head</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length > 0 ? (
                                data.map((el, i) => (
                                    <tr key={el._id}>
                                        <td>{i + 1}</td>
                                        <td>{el.ticketId}</td>
                                        <td>{el.storeId?.storeName}</td>
                                        <td>{el.expenseHeadId?.name}</td>
                                        <td>₹ {el.amount}</td>
                                        <td>
                                            <span className="badge bg-secondary">Closed</span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleViewClick(el)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        No Closed Tickets
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= MODAL ================= */}
            {showModal && selectedExpense && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Expense Details</h5>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        backgroundColor: "red",
                                        color: "white",
                                        fontWeight: "bold",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                    }}
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="modal-body px-4">

                                <div className="p-4 mb-4 rounded shadow-sm bg-light border">
                                    <div className="row g-3">

                                        <div className="col-md-6">
                                            <div className="text-muted small">Ticket ID</div>
                                            <div className="fw-semibold">{selectedExpense.ticketId}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Store</div>
                                            <div className="fw-semibold">{selectedExpense.storeId?.storeName}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Expense Head</div>
                                            <div className="fw-semibold">{selectedExpense.expenseHeadId?.name}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Amount</div>
                                            <div className="fw-semibold text-success">
                                                ₹ {selectedExpense.amount}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Policy</div>
                                            <div>{selectedExpense.policy || "-"}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Nature of Expense</div>
                                            <div>{selectedExpense.natureOfExpense || "-"}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Prism ID</div>
                                            <div>{selectedExpense.prismId || "-"}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="text-muted small">Status</div>
                                            <span className="badge bg-secondary px-3 py-2">
                                                Closed
                                            </span>
                                        </div>

                                    </div>

                                    {/* ===== TIMELINE ===== */}
                                    <div className="col-12 mt-4">
                                        <h5 className="text-primary">Approval Timeline</h5>

                                        {buildTimeline(selectedExpense).map((item, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 mb-3 rounded shadow-sm ${item.type === "HOLD"
                                                    ? "bg-light border-start border-danger border-4"
                                                    : item.type === "APPROVED"
                                                        ? "bg-white border-start border-success border-4"
                                                        : item.type === "REJECTED"
                                                            ? "bg-light border-start border-danger border-4"
                                                            : item.type === "EXECUTION"
                                                                ? "bg-white border-start border-info border-4"
                                                                : "bg-white border-start border-primary border-4"
                                                    }`}
                                            >

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

                                                {["APPROVED", "REJECTED", "HOLD"].includes(item.type) && (
                                                    <>
                                                        <h6
                                                            className={`mb-2 ${item.type === "APPROVED"
                                                                ? "text-success"
                                                                : "text-danger"
                                                                }`}
                                                        >
                                                            {item.level} {item.type}
                                                        </h6>
                                                        <p>
                                                            <strong>Comment:</strong>{" "}
                                                            {item.comment || "-"}
                                                        </p>
                                                    </>
                                                )}

                                                <div
                                                    className="text-muted mt-2"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    {new Date(item.date).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </main>
    );
}
