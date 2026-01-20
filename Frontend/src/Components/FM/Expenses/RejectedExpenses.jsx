import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function RejectedExpenses() {

    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showModal, setShowModal] = useState(false);

    /* ================= FETCH REJECTED EXPENSES ================= */
    useEffect(() => {
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            Swal.fire("Error", "User not logged in", "error");
            setLoad(false);
            return;
        }

        ApiServices.MyExpenses({
            userId: userId,
            currentStatus: "Rejected"
        })
        .then((res) => {
            if (res?.data?.success) {
                setData(res?.data?.data || []);
            } else {
                setData([]);
            }
            setTimeout(() => setLoad(false), 500);
        })
        .catch(() => {
            setData([]);
            setTimeout(() => setLoad(false), 500);
        });
    }, []);

    /* ================= MODAL HANDLERS ================= */
    const handleViewClick = (expense) => {
        setSelectedExpense(expense);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedExpense(null);
        setShowModal(false);
    };

    /* ================= DOWNLOAD HANDLER ================= */
    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className="main" id="main">
            <PageTitle child="Rejected Expenses" />

            {/* Loader */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <ScaleLoader
                            color="#6776f4"
                            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                            size={200}
                            loading={load}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            {!load && (
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mt-4 table-responsive">
                            <table className="table table-hover table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Ticket ID</th>
                                        <th>Store</th>
                                        <th>Expense Head</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((el, index) => (
                                            <tr key={el._id}>
                                                <td>{index + 1}</td>
                                                <td>{el.ticketId}</td>
                                                <td>{el.storeId?.storeName}</td>
                                                <td>{el.expenseHeadId?.name}</td>
                                                <td>₹ {el.amount}</td>
                                                <td>
                                                    <span className="badge bg-danger">
                                                        Rejected
                                                    </span>
                                                </td>
                                                <td>{new Date(el.createdAt).toLocaleDateString()}</td>
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
                                            <td colSpan="8" className="text-center text-muted">
                                                No Rejected Expenses Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL ================= */}
            {showModal && selectedExpense && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
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
                                        borderRadius: "50%",
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
                                        <strong>Status:</strong>
                                        <p>
                                            <span className="badge bg-danger">Rejected</span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Created At:</strong>
                                        <p>{new Date(selectedExpense.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Policy:</strong>
                                        <p>{selectedExpense.policy || "N/A"}</p>
                                    </div>
                                    <div className="col-12">
                                        <strong>Attachment:</strong>
                                        <p>
                                            {selectedExpense.attachment ? (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleDownload(selectedExpense.attachment)}
                                                >
                                                    Download Attachment
                                                </button>
                                            ) : (
                                                <span className="text-muted">No Attachment</span>
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
