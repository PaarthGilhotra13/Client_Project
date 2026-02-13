// hold expense
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function HoldExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resubmitFile, setResubmitFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fmComment, setFmComment] = useState("");
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
      })
      .finally(() => setLoad(false));
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = data.filter((el) =>
    el.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.storeId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.expenseHeadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentExpenses = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= CSV DATA ================= */
  const csvData = filteredData.map((el, index) => ({
    SrNo: index + 1,
    TicketID: el.ticketId,
    Store: el.storeId?.storeName,
    ExpenseHead: el.expenseHeadId?.name,
    Amount: el.amount,
    Status: "Hold",
    CreatedAt: new Date(el.createdAt).toLocaleDateString(),
  }));

  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setResubmitFile(null);
    setFmComment("");
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
    if (!fmComment.trim()) {
      Swal.fire("Error", "Please enter comment", "error");
      return;
    }

    const formData = new FormData();
    formData.append("expenseId", selectedExpense._id);
    formData.append("attachment", resubmitFile);
    formData.append("fmComment", fmComment);

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
  
  const buildTimeline = (expense) => {
    if (!expense) return [];

    const timeline = [];

    // 1️⃣ Original Upload (First Entry)
    if (expense.attachment) {
      timeline.push({
        type: "ORIGINAL",
        attachment: expense.attachment,
        date: expense.createdAt
      });
    }

    const holds = expense.holdHistory || [];
    const resubs = expense.resubmissions || [];

    for (let i = 0; i < holds.length; i++) {

      // HOLD
      timeline.push({
        type: "HOLD",
        level: holds[i].level,
        heldByName: holds[i].heldBy?.name,
        heldByDesignation: holds[i].heldBy?.designation,
        comment: holds[i].comment,
        prAttachment: holds[i].prAttachment,
        poAttachment: holds[i].poAttachment,
        date: holds[i].heldAt
      });

      // FM RESUBMIT
      if (resubs[i]) {
        timeline.push({
          type: "RESUBMIT",
          comment: resubs[i].fmComment,
          attachment: resubs[i].attachment,
          date: resubs[i].submittedAt
        });
      }
    }

    return timeline;
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Hold Expenses" />

      {/* Loader */}
      <div className="container-fluid">
        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />
      </div>

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Ticket ID, Store or Expense Head"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="col-md-6 text-end">
              <CSVLink
                data={csvData}
                filename="Hold_Expenses.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!load && (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt-3 table-responsive">
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
                  {currentExpenses.length ? (
                    currentExpenses.map((el, index) => (
                      <tr key={el._id}>
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
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
                            type="button"
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
                      <td colSpan={8} className="text-center text-muted">
                        No Hold Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-light"
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="btn btn-secondary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {/* Modal */}
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
                {/* <div className="row g-3"> */}

                  <div className="p-4 mb-4 rounded shadow-sm bg-light border">
                    <div className="row g-3">

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Ticket ID</div>
                          <div className="fw-semibold">{selectedExpense.ticketId}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Store</div>
                          <div className="fw-semibold">{selectedExpense.storeId?.storeName}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Expense Head</div>
                          <div className="fw-semibold">{selectedExpense.expenseHeadId?.name}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Amount</div>
                          <div className="fw-semibold text-success">₹ {selectedExpense.amount}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Policy</div>
                          <div className="fw-semibold">{selectedExpense.policy || "-"}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Nature of Expense</div>
                          <div className="fw-semibold">{selectedExpense.natureOfExpense}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">RCA</div>
                          <div>{selectedExpense.rca || "-"}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div>
                          <div className="text-muted small">Remarks</div>
                          <div>{selectedExpense.remark || "-"}</div>
                        </div>
                      </div>

                      {/* Status + Hold Comment */}
                      <div className="col-md-6">
                        <div className="text-muted small">Status</div>
                        <span className="badge bg-warning text-dark px-3 py-2">
                          {selectedExpense.currentStatus}
                        </span>
                      </div>

                      <div className="col-md-6">
                        <div className="text-muted small">Latest Hold Comment</div>
                        <div className="text-danger fw-semibold">
                          {selectedExpense.holdComment || "-"}
                        </div>
                      </div>

                    </div>

                    {/* ===== ATTACHMENTS ===== */}


                    {/* ===== HOLD HISTORY ===== */}
                    {/* ===== FULL TIMELINE ===== */}
                    <div className="col-12 mt-4">
                      <h5 className="text-primary">Approval Timeline</h5>

                      {buildTimeline(selectedExpense).map((item, index) => (

                        <div
                          key={index}
                          className={`p-3 mb-3 rounded shadow-sm ${item.type === "HOLD"
                            ? "bg-light border-start border-danger border-4"
                            : item.type === "RESUBMIT"
                              ? "bg-white border-start border-success border-4"
                              : "bg-white border-start border-primary border-4"
                            }`}
                        >

                          {/* ORIGINAL */}
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

                          {/* HOLD */}
                          {item.type === "HOLD" && (
                            <>
                              <h6 className="text-danger mb-2">
                                {item.heldByName
                                  ? `${item.heldByName} (${item.heldByDesignation?.replace(/_/g, " ")})`
                                  : item.level}{" "}
                                placed on HOLD
                              </h6>

                              <p><strong>Comment:</strong> {item.comment}</p>

                              {item.prAttachment && (
                                <a
                                  href={item.prAttachment}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-info me-2"
                                >
                                  PR Attachment
                                </a>
                              )}

                              {item.poAttachment && (
                                <a
                                  href={item.poAttachment}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-secondary"
                                >
                                  PO Attachment
                                </a>
                              )}
                            </>
                          )}

                          {/* FM RESUBMIT */}
                          {item.type === "RESUBMIT" && (
                            <>
                              <h6 className="text-success mb-2">
                                FM Resubmitted
                              </h6>

                              <p><strong>FM Comment:</strong> {item.comment}</p>

                              {item.attachment && (
                                <a
                                  href={item.attachment}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-success"
                                >
                                  FM Attachment
                                </a>
                              )}
                            </>
                          )}

                          <div className="text-muted mt-2" style={{ fontSize: "12px" }}>
                            {new Date(item.date).toLocaleString()}
                          </div>
                        </div>
                      ))}

                    </div>



                    {/* ===== RESUBMIT FILE ===== */}
                    <div className="col-6">
                      <label className="form-label">
                        Upload New Attachment (Required)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setResubmitFile(e.target.files[0])}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">FM Comment (Required)</label>
                      <input
                        className="form-control"
                        rows="3"
                        value={fmComment}
                        onChange={(e) => setFmComment(e.target.value)}
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
