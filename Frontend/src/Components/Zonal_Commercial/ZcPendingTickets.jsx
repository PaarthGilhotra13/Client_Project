// Zonal Commercial - Pending Tickets
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import ApiServices from "../../ApiServices";
import PageTitle from "../PageTitle";

export default function ZcPendingTickets() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [prismId, setPrismId] = useState("");

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        ApiServices.ZcPendingExpense({
            userId,
            currentApprovalLevel: "ZONAL_COMMERCIAL",
            postApprovalStage: "ZC_VERIFY",
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

    const handleView = (exp) => {
        setSelected(exp);
        setPrismId("");
        setShowModal(true);
    };

    const handleClose = () => {
        setSelected(null);
        setShowModal(false);
    };

    const handleVerifyClose = () => {
        if (!prismId) {
            return Swal.fire("Error", "Prism ID is required", "error");
        }

        ApiServices.VerifyAndCloseExpense({
            expenseId: selected._id,
            prismId,
            approverId: userId   // ✅ THIS IS THE FIX
        })
            .then((res) => {
                if (res?.data?.success) {
                    Swal.fire("Closed", "Ticket closed successfully", "success");
                    setData((prev) => prev.filter((e) => e._id !== selected._id));
                    handleClose();
                } else {
                    Swal.fire("Error", res.data.message, "error");
                }
            })
            .catch(() => {
                Swal.fire("Error", "Closing failed", "error");
            });
    };


    return (
        <main className="main" id="main">
            <PageTitle child="Pending Tickets (Zonal Commercial)" />

            {load ? (
                <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} />
            ) : (
                <div className="container-fluid mt-4 table-responsive">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Ticket ID</th>
                                <th>Store</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? (
                                data.map((el, i) => (
                                    <tr key={el._id}>
                                        <td>{i + 1}</td>
                                        <td>{el.ticketId}</td>
                                        <td>{el.storeId?.storeName}</td>
                                        <td>₹ {el.amount}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleView(el)}
                                            >
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        No Pending Tickets
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== MODAL ===== */}
            {/* ===== MODAL ===== */}
            {showModal && selected && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Expense Details (Zonal Commercial)</h5>
                                <button
                                    type="button"
                                    onClick={handleClose}
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
                                    &times;
                                </button>
                            </div>

                            <div className="modal-body px-4">
                                {/* ===== SAME DETAILS AS FM APPROVED PAGE ===== */}
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <strong>Ticket ID:</strong>
                                        <p>{selected.ticketId}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Store:</strong>
                                        <p>{selected.storeId?.storeName}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Expense Head:</strong>
                                        <p>{selected.expenseHeadId?.name}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Amount:</strong>
                                        <p>₹ {selected.amount}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Policy:</strong>
                                        <p>{selected.policy || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Nature of Expense:</strong>
                                        <p>{selected.natureOfExpense || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>RCA:</strong>
                                        <p>{selected.rca || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Remarks:</strong>
                                        <p>{selected.remark || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Status:</strong>
                                        <span className="badge bg-warning">Pending Verification</span>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Created At:</strong>
                                        <p>{new Date(selected.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    {/* ===== ATTACHMENTS (ORIGINAL + RESUBMITTED) ===== */}
                                    <div className="col-12">
                                        <strong>Attachments:</strong>
                                        <p>
                                            {selected.attachment && (
                                                <a
                                                    href={selected.attachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-primary me-2"
                                                >
                                                    Original Attachment
                                                </a>
                                            )}

                                            {selected.resubmittedAttachment && (
                                                <a
                                                    href={selected.resubmittedAttachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-success me-2"
                                                >
                                                    Resubmitted Attachment
                                                </a>
                                            )}

                                            {!selected.attachment &&
                                                !selected.resubmittedAttachment && (
                                                    <span className="text-muted">No Attachment</span>
                                                )}
                                        </p>
                                    </div>

                                    {/* ===== WCR & INVOICE (FM UPLOADED) ===== */}
                                    <div className="col-12">
                                        <strong>Execution Documents:</strong>
                                        <p>
                                            {selected.wcrAttachment && (
                                                <a
                                                    href={selected.wcrAttachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-info me-2"
                                                >
                                                    WCR
                                                </a>
                                            )}

                                            {selected.invoiceAttachment && (
                                                <a
                                                    href={selected.invoiceAttachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-secondary me-2"
                                                >
                                                    Invoice
                                                </a>
                                            )}

                                            {!selected.wcrAttachment &&
                                                !selected.invoiceAttachment && (
                                                    <span className="text-muted">
                                                        No execution documents
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                </div>

                                {/* ===== ZC ACTION ===== */}
                                <hr />
                                <h6 className="fw-bold text-primary">Zonal Commercial Action</h6>

                                <div className="row g-3 mt-2">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Prism ID</label>
                                        <input
                                            className="form-control"
                                            value={prismId}
                                            onChange={(e) => setPrismId(e.target.value)}
                                            placeholder="Enter Prism ID"
                                        />
                                    </div>

                                    <div className="col-12 text-end mt-3">
                                        <button
                                            className="btn btn-success"
                                            onClick={handleVerifyClose}
                                        >
                                            Verify & Close Ticket
                                        </button>
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
