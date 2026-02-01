// Zonal Commercial - Approved Tickets
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import ApiServices from "../../ApiServices";
import PageTitle from "../PageTitle";

export default function ZcApprovedTickets() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        ApiServices.MyApprovalActions({
            userId,
            level: "ZONAL_COMMERCIAL",
            action: "Closed"
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
        setSelected(exp.expenseId); // ⚠️ coming from history
        setShowModal(true);
    };

    const handleClose = () => {
        setSelected(null);
        setShowModal(false);
    };

    return (
        <main className="main" id="main">
            <PageTitle child="Approved Tickets (Zonal Commercial)" />

            {load ? (
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                />
            ) : (
                <div className="container-fluid mt-4 table-responsive">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Ticket ID</th>
                                <th>Store</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? (
                                data.map((el, i) => (
                                    <tr key={el._id}>
                                        <td>{i + 1}</td>
                                        <td>{el.expenseId?.ticketId}</td>
                                        <td>{el.expenseId?.storeId?.storeName}</td>
                                        <td>₹ {el.expenseId?.amount}</td>
                                        <td>
                                            <span className="badge bg-success">
                                                Closed
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleView(el)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        No Approved Tickets
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== MODAL (SAME AS PENDING, READ-ONLY) ===== */}
            {showModal && selected && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Expense Details (Zonal Commercial)
                                </h5>
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
                                        cursor: "pointer",
                                        fontSize: "18px",
                                    }}
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="modal-body px-4">
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
                                        <strong>Nature of Expense:</strong>
                                        <p>{selected.natureOfExpense || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Policy:</strong>
                                        <p>{selected.policy || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>RCA:</strong>
                                        <p>{selected.rca || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Remark:</strong>
                                        <p>{selected.remark || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Raised By:</strong>
                                        <p>{selected.raisedBy?.name || selected.raisedBy?.fullName || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Created At:</strong>
                                        <p>{new Date(selected.createdAt).toLocaleString()}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Prism ID:</strong>
                                        <p>{selected.prismId || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Status:</strong>
                                        <span className="badge bg-success">
                                            Closed
                                        </span>
                                    </div>

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
                                        </p>
                                    </div>

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
                                        </p>
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
