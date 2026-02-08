import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";

export default function PrPoPendingExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // PR/PO inputs
  const [prComment, setPrComment] = useState("");
  const [poComment, setPoComment] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isEmailStage =
    selectedExpense?.postApprovalStage === "PRPO_EMAIL";
  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH PENDING (PR/PO) ================= */
  const fetchPending = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    setLoad(true);

    ApiServices.GetPrPoPendingExpenses({ userId })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
      })
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = data.filter(
    (el) =>
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
    Status: "Pending",
  }));

  /* ================= MODAL ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setPrComment("");
    setPoComment("");
    setAttachmentFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
    setPrComment("");
    setPoComment("");
    setAttachmentFile(null);
    setEmailSubject("");

  };

  /* ================= ACTION HANDLER ================= */
  const takeAction = (type) => {
    if (isEmailStage) {
      return Swal.fire(
        "Error",
        "This expense is already approved. Please close it using Email Subject.",
        "warning"
      );
    }
    if (type === "Approve") {
      if (!prComment.trim() || !poComment.trim()) {
        return Swal.fire(
          "Error",
          "PR & PO comments are mandatory for approval",
          "error"
        );
      }
    }

    const formData = new FormData();
    formData.append("expenseId", selectedExpense._id);
    formData.append("approverId", userId);

    // 🔥 APPROVE CASE
    if (type === "Approve") {
      formData.append("prComment", prComment);
      formData.append("poComment", poComment);
      formData.append(
        "comment",
        `PR: ${prComment} | PO: ${poComment}`
      );
    }

    // 🔥 HOLD / REJECT CASE
    if (type === "Hold" || type === "Reject") {
      if (!prComment.trim()) {
        return Swal.fire(
          "Error",
          "Comment is mandatory",
          "error"
        );
      }
      formData.append("comment", prComment);
    }

    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
    }

    setLoad(true);

    let apiCall;
    if (type === "Approve") apiCall = ApiServices.ApproveExpense;
    if (type === "Hold") apiCall = ApiServices.HoldExpense;
    if (type === "Reject") apiCall = ApiServices.RejectExpense;

    apiCall(formData)
      .then((res) => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          handleCloseModal();
          fetchPending();
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  };

  const closeExpense = () => {
    if (!emailSubject.trim()) {
      return Swal.fire(
        "Error",
        "Email subject is mandatory",
        "error"
      );
    }

    setLoad(true);

    ApiServices.PrpoEmailAndClose({
      expenseId: selectedExpense._id,
      emailSubject: emailSubject,
      approverId: userId
    })
      .then((res) => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          handleCloseModal();
          fetchPending();
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Pending Expenses (PR/PO)" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Ticket ID, Store, Expense Head"
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
                filename="PRPO_Pending_Expenses.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      )}

      {!load && (
        <div className="container-fluid">
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
                {currentExpenses.length ? (
                  currentExpenses.map((el, index) => (
                    <tr key={el._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{el.ticketId}</td>
                      <td>{el.storeId?.storeName}</td>
                      <td>{el.expenseHeadId?.name}</td>
                      <td>₹ {el.amount}</td>
                      <td>
                        <span className="badge bg-warning">Pending</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
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
                      No Pending Expenses Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
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
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body px-4">
                {/* DETAILS */}
                <div className="row g-3">
                  <div className="col-md-6"><strong>Ticket ID:</strong><p>{selectedExpense.ticketId}</p></div>
                  <div className="col-md-6"><strong>Store:</strong><p>{selectedExpense.storeId?.storeName}</p></div>
                  <div className="col-md-6"><strong>Expense Head:</strong><p>{selectedExpense.expenseHeadId?.name}</p></div>
                  <div className="col-md-6"><strong>Amount:</strong><p>₹ {selectedExpense.amount}</p></div>
                  <div className="col-md-6"><strong>Policy:</strong><p>{selectedExpense.policy || "-"}</p></div>
                  <div className="col-md-6"><strong>Nature:</strong><p>{selectedExpense.natureOfExpense || "-"}</p></div>
                  <div className="col-md-6"><strong>RCA:</strong><p>{selectedExpense.rca || "-"}</p></div>
                  <div className="col-md-6"><strong>Remarks:</strong><p>{selectedExpense.remark || "-"}</p></div>
                </div>
                <hr />

                <div className="col-12">
                  <strong>Attachments:</strong>
                  <p className="mt-2">
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
                {selectedExpense.fmComment && (
                  <div className="mt-2">
                    <strong>FM Comment:</strong>
                    <p>{selectedExpense.fmComment}</p>
                  </div>
                )}

                {selectedExpense.wcrAttachment && (
                  <a
                    href={selectedExpense.wcrAttachment}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-info me-2"
                  >
                    WCR
                  </a>
                )}

                {selectedExpense.invoiceAttachment && (
                  <a
                    href={selectedExpense.invoiceAttachment}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-warning"
                  >
                    Invoice
                  </a>
                )}

                <hr />

                {/* PR / PO INPUTS */}
                {!isEmailStage && (
                  <>
                    <label className="form-label fw-bold">PR Comment *</label>
                    <textarea
                      className="form-control"
                      value={prComment}
                      onChange={(e) => setPrComment(e.target.value)}
                    />

                    <label className="form-label fw-bold mt-2">PO Comment *</label>
                    <textarea
                      className="form-control"
                      value={poComment}
                      onChange={(e) => setPoComment(e.target.value)}
                    />

                    <label className="form-label fw-bold mt-2">Attachment</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setAttachmentFile(e.target.files[0])}
                    />
                  </>
                )}

              </div>
              {/* {isEmailStage && (
                <>
                  <label className="form-label fw-bold mt-3">
                    Email Subject *
                  </label>
                  <input
                    className="form-control"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject"
                  />
                </>
              )}

              {!isEmailStage && (
                <>
                  <button onClick={() => takeAction("Approve")}>Approve</button>
                  <button onClick={() => takeAction("Hold")}>Hold</button>
                  <button onClick={() => takeAction("Reject")}>Reject</button>
                </>
              )}

              {isEmailStage && (
                <button
                  className="btn btn-success"
                  onClick={closeExpense}
                >
                  Close
                </button>
              )} */}

              {selectedExpense?.currentApprovalLevel === "PR/PO" &&
                selectedExpense?.postApprovalStage === "PRPO_EMAIL" && (
                  <>
                    <div className="col-12">
                      <label className="form-label fw-bold">Email Subject *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>

                    <div className="col-12 text-end mt-3">
                      <button
                        className="btn btn-success w-100"
                        onClick={closeExpense}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}


            </div>
          </div>
        </div>
      )}
    </main>
  );
}
