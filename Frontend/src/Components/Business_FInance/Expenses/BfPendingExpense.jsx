import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function BfPendingExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH BF PENDING ================= */
  const fetchPending = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.GetBfPendingExpenses({ userId })
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
    fetchPending();
  }, []);

  /* ================= MODAL ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  /* ================= ACTION ================= */
  const takeAction = (type, expenseId) => {
    Swal.fire({
      title: `Confirm ${type}`,
      input: "textarea",
      inputPlaceholder: "Enter comment (optional)",
      showCancelButton: true,
      confirmButtonText: type,
    }).then((result) => {
      if (!result.isConfirmed) return;

      const payload = {
        expenseId,
        approverId: userId,
        comment: result.value || "",
      };

      setLoad(true);

      let apiCall;
      if (type === "Approve") apiCall = ApiServices.ApproveExpense;
      if (type === "Hold") apiCall = ApiServices.HoldExpense;
      if (type === "Reject") apiCall = ApiServices.RejectExpense;

      apiCall(payload)
        .then((res) => {
          setLoad(false);
          if (res?.data?.success) {
            Swal.fire("Success", res.data.message, "success");
            fetchPending();
          } else {
            Swal.fire("Error", res.data.message, "error");
          }
        })
        .catch(() => {
          setLoad(false);
          Swal.fire("Error", "Something went wrong", "error");
        });
    });
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Pending Expenses (Business Finance)" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

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
                          <span className="badge bg-warning">Pending</span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleViewClick(el)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-success btn-sm ms-1"
                              onClick={() => takeAction("Approve", el._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm ms-1"
                              onClick={() => takeAction("Hold", el._id)}
                            >
                              Hold
                            </button>
                            <button
                              className="btn btn-danger btn-sm ms-1"
                              onClick={() => takeAction("Reject", el._id)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No Pending Expenses Found
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

                  {/* Attachments */}
                  <div className="col-12">
                    <strong>Attachment:</strong>
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
                          className="btn btn-sm btn-success"
                        >
                          Resubmitted
                        </a>
                      )}

                      {!selectedExpense.attachment &&
                        !selectedExpense.resubmittedAttachment && (
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
