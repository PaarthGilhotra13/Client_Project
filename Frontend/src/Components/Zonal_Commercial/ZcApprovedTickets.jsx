import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import ApiServices from "../../ApiServices";
import PageTitle from "../PageTitle";
import ExpenseTimeline from "../common/ExpenseTimeline";
import ExpenseDetails from "../common/ExpenseDetails";

export default function ZcApprovedTickets() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    ApiServices.MyApprovalActions({
      userId,
      level: "ZONAL_COMMERCIAL",
      action: "Closed",
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
    setSelected(exp.expenseId);
    setShowModal(true);

<<<<<<< Updated upstream
    const handleView = (exp) => {
        const actualExpense = exp.expenseId ?? exp;

        setSelected(actualExpense);
        setShowModal(true);

        ApiServices.ExpenseHistory({ expenseId: actualExpense?._id })
            .then((res) => {
                setApprovalHistory(res?.data?.data || []);
            })
            .catch(() => {
                setApprovalHistory([]);
            });
    };
=======
    ApiServices.ExpenseHistory({ expenseId: exp.expenseId._id })
      .then((res) => {
        setApprovalHistory(res?.data?.data || []);
      })
      .catch(() => {
        setApprovalHistory([]);
      });
  };

  const handleClose = () => {
    setSelected(null);
    setShowModal(false);
  };
>>>>>>> Stashed changes

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
                <th>Sr. No</th>
                <th>Created At</th>
                <th>Ticket ID</th>
                <th>Store</th>
                <th>Nature of Expense</th>
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
                    <td>
                      {el.createdAt
                        ? new Date(el.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td>{el.expenseId?.ticketId}</td>
                    <td>{el.expenseId?.storeId?.storeName}</td>
                    <td>{el.expenseId?.natureOfExpense}</td>

                    <td>₹ {el.expenseId?.amount}</td>
                    <td>
                      <span className="badge bg-success">Closed</span>
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

<<<<<<< Updated upstream
                            <div className="modal-body px-4">

                                <div className="p-4 mb-4 rounded shadow-sm bg-light border">

                                    {/* ================= BASIC DETAILS ================= */}
                                    <ExpenseDetails
                                        show={showModal}
                                        onClose={handleClose}
                                        expense={selected}
                                        approvalHistory={approvalHistory}
                                        page="Approved"
                                    />

                                </div>

                            </div>



                        </div>
=======
              <div className="modal-body px-4">
                <div className="p-4 mb-4 rounded shadow-sm bg-light border">
                  {/* ================= BASIC DETAILS ================= */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="text-muted small">Ticket ID</div>
                      <div className="fw-semibold">{selected.ticketId}</div>
>>>>>>> Stashed changes
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Store</div>
                      <div className="fw-semibold">
                        {selected.storeId?.storeName}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Expense Head</div>
                      <div className="fw-semibold">
                        {selected.expenseHeadId?.name}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Amount</div>
                      <div className="fw-semibold text-success">
                        ₹ {selected.amount}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Policy</div>
                      <div className="fw-semibold">
                        {selected.policy || "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense</div>
                      <div className="fw-semibold">
                        {selected.natureOfExpense || "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Prism ID</div>
                      <div className="fw-semibold">
                        {selected.prismId || "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-success px-3 py-2">Closed</span>
                    </div>
                  </div>

                  {/* ================= TIMELINE ================= */}
                  <ExpenseTimeline
                    expense={selected}
                    approvalHistory={approvalHistory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
