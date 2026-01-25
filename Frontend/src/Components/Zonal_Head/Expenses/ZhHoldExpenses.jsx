import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function ZhHoldExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH HOLD (ZONAL HEAD) ================= */
  const fetchHold = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.MyApprovalActions({
      userId,
      action: "Hold",
      level: "ZONAL_HEAD",
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
    fetchHold();
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
      <PageTitle child="Hold Expenses (Zonal Head)" />

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
                    <th>Hold On</th>
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
                          {new Date(el.updatedAt || el.createdAt).toLocaleDateString()}
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
                    <strong>Hold Comment:</strong>
                    <p>{selectedExpense.holdComment || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <p>
                      <span className="badge bg-warning text-dark">Hold</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Hold On:</strong>
                    <p>
                      {new Date(
                        selectedExpense.updatedAt || selectedExpense.createdAt
                      ).toLocaleDateString()}
                    </p>
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
