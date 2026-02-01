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
    };

    const handleCloseModal = () => {
        setSelectedExpense(null);
        setShowModal(false);
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
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                                <div className="row g-3">

                                    <div className="col-md-6">
                                        <strong>Ticket ID:</strong>
                                        <p>{selectedExpense.ticketId}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Store:</strong>
                                        <p>{selectedExpense.storeId?.storeName}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Expense Head:</strong>
                                        <p>{selectedExpense.expenseHeadId?.name}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Amount:</strong>
                                        <p>₹ {selectedExpense.amount}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Policy:</strong>
                                        <p>{selectedExpense.policy || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Nature of Expense:</strong>
                                        <p>{selectedExpense.natureOfExpense || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>RCA:</strong>
                                        <p>{selectedExpense.rca || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Remarks:</strong>
                                        <p>{selectedExpense.remark || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Prism ID:</strong>
                                        <p>{selectedExpense.prismId || "-"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Status:</strong>
                                        <span className="badge bg-secondary">Closed</span>
                                    </div>

                                    <div className="col-md-6">
                                        <strong>Created At:</strong>
                                        <p>{new Date(selectedExpense.createdAt).toLocaleString()}</p>
                                    </div>

                                    {/* Attachments */}
                                    <div className="col-12">
                                        <strong>Attachments:</strong>
                                        <p>
                                            {selectedExpense.attachment && (
                                                <a
                                                    href={selectedExpense.attachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-primary me-2"
                                                >
                                                    Original
                                                </a>
                                            )}

                                            {selectedExpense.resubmittedAttachment && (
                                                <a
                                                    href={selectedExpense.resubmittedAttachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-success me-2"
                                                >
                                                    Resubmitted
                                                </a>
                                            )}
                                        </p>
                                    </div>

                                    {/* Execution Docs */}
                                    <div className="col-12">
                                        <strong>Execution Documents:</strong>
                                        <p>
                                            {selectedExpense.wcrAttachment && (
                                                <a
                                                    href={selectedExpense.wcrAttachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-info me-2"
                                                >
                                                    WCR
                                                </a>
                                            )}

                                            {selectedExpense.invoiceAttachment && (
                                                <a
                                                    href={selectedExpense.invoiceAttachment}
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
