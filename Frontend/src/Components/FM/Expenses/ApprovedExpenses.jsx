// Approved expense (FM)
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function ApprovedExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wcrFile, setWcrFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [fmComment, setFmComment] = useState("");
  const [approvalHistory, setApprovalHistory] = useState([]);

  /* ================= FETCH APPROVED (FM PENDING) ================= */
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    // ApiServices.MyExpenses({
    //   userId,
    //   currentStatus: "Approved",
    //   currentApprovalLevel: "FM",
    //   postApprovalStage: "FM_PENDING",
    // })
    ApiServices.MyExpenses({
      userId,
      currentStatus: "Approved",
      currentApprovalLevel: "FM",
      postApprovalStage: "FM_PENDING"
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

  /* ================= VIEW MODAL ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setWcrFile(null);
    setInvoiceFile(null);
    setFmComment("");
    setShowModal(true);

    ApiServices.ExpenseHistory({ expenseId: expense._id })
      .then(res => {
        setApprovalHistory(res?.data?.data || []);
      })
      .catch(() => {
        setApprovalHistory([]);
      });
  };


  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
    setWcrFile(null);
    setInvoiceFile(null);
    setFmComment("");
  };

  /* ================= UPLOAD WCR + INVOICE + COMMENT ================= */
  const handleUploadDocs = () => {
    if (!wcrFile || !invoiceFile || !fmComment.trim()) {
      return Swal.fire(
        "Error",
        "WCR, Invoice & FM Comment are required",
        "error"
      );
    }

    const formData = new FormData();
    formData.append("expenseId", selectedExpense._id);
    formData.append("wcr", wcrFile);
    formData.append("invoice", invoiceFile);
    formData.append("fmComment", fmComment);
    formData.append("fmId", sessionStorage.getItem("userId"));

    ApiServices.UploadWcrInvoice(formData)
      .then((res) => {
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");

          // FM ka kaam complete → list se remove
          setData((prev) =>
            prev.filter((e) => e._id !== selectedExpense._id)
          );

          handleCloseModal();
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Upload failed", "error");
      });
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Approved Expenses" />

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
                      <span className="badge bg-success">Approved</span>
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
                    No Approved Expenses
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
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body px-4">
                {/* ===== DETAILS (UNCHANGED) ===== */}
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
                      {!selectedExpense.attachment &&
                        !selectedExpense.resubmittedAttachment && (
                          <span className="text-muted">No Attachment</span>
                        )}
                    </p>
                  </div>
                </div>
                <hr />
                <h6 className="fw-bold text-secondary">Approval History</h6>

                {approvalHistory.length ? (
                  approvalHistory.map((h, i) => (
                    <div key={i} className="border rounded p-2 mb-2">
                      <p className="mb-1">
                        <strong>{h.level}</strong> — {h.action}
                      </p>
                      <p className="mb-1">{h.comment || "-"}</p>
                      <small className="text-muted">
                        {new Date(h.actionAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No approval history found</p>
                )}

                {/* ===== PR / PO DETAILS (ONLY IF APPLICABLE) ===== */}
                {(selectedExpense.natureOfExpense === "CAPEX" ||
                  selectedExpense.prComment ||
                  selectedExpense.poComment ||
                  selectedExpense.prAttachment ||
                  selectedExpense.poAttachment) && (
                    <>
                      <hr />
                      <h6 className="fw-bold text-secondary">PR / PO Details</h6>

                      {selectedExpense.prComment && (
                        <p>
                          <strong>PR Comment:</strong> {selectedExpense.prComment}
                        </p>
                      )}

                      {selectedExpense.poComment && (
                        <p>
                          <strong>PO Comment:</strong> {selectedExpense.poComment}
                        </p>
                      )}

                      <div className="mt-2">
                        {selectedExpense.prAttachment && (
                          <a
                            href={selectedExpense.prAttachment}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            View PR Attachment
                          </a>
                        )}

                        {selectedExpense.poAttachment && (
                          <a
                            href={selectedExpense.poAttachment}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View PO Attachment
                          </a>
                        )}
                      </div>
                    </>
                  )}


                {/* ===== FM EXECUTION SECTION ===== */}
                <hr />
                <h6 className="fw-bold text-primary">
                  Upload Execution Documents
                </h6>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Upload WCR</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setWcrFile(e.target.files[0])}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      Upload Invoice
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setInvoiceFile(e.target.files[0])}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">
                      FM Comment <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter execution comment"
                      value={fmComment}
                      onChange={(e) => setFmComment(e.target.value)}
                    />
                  </div>

                  <div className="col-12 text-end mt-3">
                    <button
                      className="btn btn-success"
                      onClick={handleUploadDocs}
                    >
                      Submit WCR & Invoice
                    </button>
                  </div>
                </div>
                {/* ===== END ===== */}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
