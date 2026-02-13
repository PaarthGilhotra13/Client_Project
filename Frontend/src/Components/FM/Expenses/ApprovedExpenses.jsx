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
  const buildTimeline = () => {
    const timeline = [];

    // ORIGINAL
    if (selectedExpense?.attachment) {
      timeline.push({
        type: "ORIGINAL",
        attachment: selectedExpense.attachment,
        date: selectedExpense.createdAt
      });
    }

    // APPROVAL HISTORY
    (approvalHistory || []).forEach((item) => {
      timeline.push({
        type: item.action.toUpperCase(),
        level: item.level,
        comment: item.comment,
        date: item.actionAt
      });
    });

    // SORT BY DATE
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    return timeline;
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

                <div className="p-4 mb-4 rounded shadow-sm bg-light border">
                  <div className="row g-3">

                    <div className="col-md-6">
                      <div className="text-muted small">Ticket ID</div>
                      <div className="fw-semibold">{selectedExpense.ticketId}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Store</div>
                      <div className="fw-semibold">
                        {selectedExpense.storeId?.storeName}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Expense Head</div>
                      <div className="fw-semibold">
                        {selectedExpense.expenseHeadId?.name}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Amount</div>
                      <div className="fw-semibold text-success">
                        ₹ {selectedExpense.amount}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Policy</div>
                      <div className="fw-semibold">
                        {selectedExpense.policy || "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Nature of Expense</div>
                      <div className="fw-semibold">
                        {selectedExpense.natureOfExpense}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">RCA</div>
                      <div>{selectedExpense.rca || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Remarks</div>
                      <div>{selectedExpense.remark || "-"}</div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">Status</div>
                      <span className="badge bg-success px-3 py-2">
                        Approved
                      </span>
                    </div>

                  </div>

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

                            <p>
                              <strong>Comment:</strong> {item.comment}
                            </p>

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

                        {/* APPROVED */}
                        {item.type === "APPROVED" && (
                          <>
                            <h6 className="text-success mb-2">
                              {item.level} Approved
                            </h6>

                            <p>
                              <strong>Comment:</strong> {item.comment || "-"}
                            </p>
                          </>
                        )}

                        {/* RESUBMIT */}
                        {item.type === "RESUBMIT" && (
                          <>
                            <h6 className="text-success mb-2">
                              FM Resubmitted
                            </h6>

                            <p>
                              <strong>FM Comment:</strong> {item.comment}
                            </p>

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

                        <div
                          className="text-muted mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ===== FM EXECUTION SECTION ===== */}
                  <div className="row mt-4 g-3">
                    <div className="col-6">
                      <label className="form-label">
                        Upload WCR (Required)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setWcrFile(e.target.files[0])}
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label">
                        Upload Invoice (Required)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setInvoiceFile(e.target.files[0])}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        FM Comment (Required)
                      </label>
                      <input
                        className="form-control"
                        value={fmComment}
                        onChange={(e) => setFmComment(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleUploadDocs}
                >
                  Submit WCR & Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
