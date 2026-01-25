import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function HoldExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [resubmitFile, setResubmitFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH HOLD EXPENSES ================= */
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyExpenses({
      userId,
      currentStatus: "Hold",
    })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setLoad(false);
      })
      .catch(() => {
        setData([]);
        setLoad(false);
      });
  }, []);

  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setResubmitFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
    setResubmitFile(null);
    setShowModal(false);
  };

  /* ================= RESUBMIT ================= */
  const handleResubmit = () => {
    if (!resubmitFile) {
      Swal.fire("Error", "Please upload attachment", "error");
      return;
    }

    const formData = new FormData();
    formData.append("expenseId", selectedExpense._id);
    formData.append("attachment", resubmitFile);

    setSubmitting(true);

    ApiServices.ReSubmitHeldExpense(formData)
      .then((res) => {
        if (res?.data?.success) {
          Swal.fire("Success", "Expense resubmitted successfully", "success");
          handleCloseModal();
          setLoad(true);

          ApiServices.MyExpenses({
            userId: sessionStorage.getItem("userId"),
            currentStatus: "Hold",
          }).then((res) => {
            setData(res?.data?.data || []);
            setLoad(false);
          });
        } else {
          Swal.fire("Error", "Resubmission failed", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Something went wrong", "error");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Hold Expenses" />

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
                          <span className="badge bg-warning text-dark">
                            Hold
                          </span>
                        </td>
                        <td>
                          {new Date(el.createdAt).toLocaleDateString()}
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
                      <td colSpan="8" className="text-center text-muted">
                        No Hold Expenses Found
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

                  <div className="col-12">
                    <strong>Hold Comment:</strong>
                    <p className="text-danger">
                      {selectedExpense.holdComment || "No Comment"}
                    </p>
                  </div>

                  <div className="col-12">
                    <strong>Attachment:</strong>
                    <p>
                      {selectedExpense.attachment ? (
                        <a
                          href={selectedExpense.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          View Attachment
                        </a>
                      ) : (
                        <span className="text-muted">No Attachment</span>
                      )}
                    </p>
                  </div>

                  <div className="col-12">
                    <strong>Resubmitted Attachment:</strong>
                    <input
                      type="file"
                      className="form-control mt-1"
                      onChange={(e) =>
                        setResubmitFile(e.target.files[0])
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  disabled={submitting}
                  onClick={handleResubmit}
                >
                  {submitting ? "Submitting..." : "Resubmit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
