import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function ClmRejectedExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH REJECTED ================= */
  const fetchRejected = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.MyApprovalActions({
      userId: userId,
      action: "Rejected",
      level: "CLM",
    })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
        setLoad(false);
      })
      .catch(() => {
        setData([]);
        setLoad(false);
      });
  };

  useEffect(() => {
    fetchRejected();
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

  return (
    <main className="main" id="main">
      <PageTitle child="Rejected Expenses (CLM)" />

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        size={200}
        loading={load}
      />

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
                    <th>Comment</th>
                    <th>Action Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((el, index) => (
                      <tr key={el._id}>
                        <td>{index + 1}</td>
                        <td>{el.expenseId?.ticketId}</td>
                        <td>{el.expenseId?.storeId?.storeName}</td>
                        <td>{el.expenseId?.expenseHeadId?.name}</td>
                        <td>₹ {el.expenseId?.amount}</td>
                        <td>
                          <span className="badge bg-danger">Rejected</span>
                        </td>

                        {/* Comment (history se) */}
                        <td>{el.comment || "-"}</td>

                        {/* Action Date */}
                        <td>
                          {el.actionAt
                            ? new Date(el.actionAt).toLocaleDateString()
                            : "-"}
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
                      <td colSpan="9" className="text-center text-muted">
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
                    <p>{selectedExpense.expenseId?.ticketId}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Store:</strong>
                    <p>{selectedExpense.expenseId?.storeId?.storeName}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Expense Head:</strong>
                    <p>{selectedExpense.expenseId?.expenseHeadId?.name}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Amount:</strong>
                    <p>₹ {selectedExpense.expenseId?.amount}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Policy:</strong>
                    <p>{selectedExpense.expenseId?.policy || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Nature of Expense:</strong>
                    <p>{selectedExpense.expenseId?.natureOfExpense || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>RCA:</strong>
                    <p>{selectedExpense.expenseId?.rca || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Remarks:</strong>
                    <p>{selectedExpense.expenseId?.remark || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <p>
                      <span className="badge bg-danger">Rejected</span>
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Rejected On:</strong>
                    <p>
                      {selectedExpense.actionAt
                        ? new Date(selectedExpense.actionAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  {/* Attachments */}
                  <div className="col-12">
                    <strong>Attachment:</strong>
                    <p>
                      {selectedExpense.expenseId?.attachment && (
                        <a
                          href={selectedExpense.expenseId.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary me-2"
                        >
                          Original
                        </a>
                      )}

                      {selectedExpense.expenseId?.resubmittedAttachment && (
                        <a
                          href={selectedExpense.expenseId.resubmittedAttachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-success"
                        >
                          Resubmitted
                        </a>
                      )}

                      {!selectedExpense.expenseId?.attachment &&
                        !selectedExpense.expenseId?.resubmittedAttachment && (
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
