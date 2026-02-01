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

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    ApiServices.MyExpenses({
      userId,
      currentStatus: "Approved",
      currentApprovalLevel: "FM",
      postApprovalStage: "FM_PENDING",
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

  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setWcrFile(null);
    setInvoiceFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
    setWcrFile(null);
    setInvoiceFile(null);
  };

  const handleUploadDocs = () => {
    if (!wcrFile || !invoiceFile) {
      return Swal.fire("Error", "WCR & Invoice both are required", "error");
    }

    const formData = new FormData();
    formData.append("expenseId", selectedExpense._id);
    formData.append("wcr", wcrFile);
    formData.append("invoice", invoiceFile);
    formData.append("fmId", sessionStorage.getItem("userId"));

    ApiServices.UploadWcrInvoice(formData)
      .then((res) => {
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          setShowModal(false);

          // FM ka kaam complete → list se hata do
          setData((prev) =>
            prev.filter((e) => e._id !== selectedExpense._id)
          );
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
                {/* ===== EXISTING DETAILS (UNCHANGED) ===== */}
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
                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <span className="badge bg-success">Approved</span>
                  </div>
                  <div className="col-md-6">
                    <strong>Created At:</strong>
                    <p>
                      {new Date(
                        selectedExpense.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-12">
                    <strong>Attachments:</strong>
                    <p>
                      {/* Original Attachment */}
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

                      {/* Resubmitted Attachment */}
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

                      {/* No attachment case */}
                      {!selectedExpense.attachment &&
                        !selectedExpense.resubmittedAttachment && (
                          <span className="text-muted">No Attachment</span>
                        )}
                    </p>
                  </div>

                </div>

                {/* ===== NEW : WCR / INVOICE UPLOAD (ONLY ADDITION) ===== */}
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

                  <div className="col-12 text-end mt-3">
                    <button
                      className="btn btn-success"
                      onClick={handleUploadDocs}
                    >
                      Submit WCR & Invoice
                    </button>
                  </div>
                </div>
                {/* ===== END NEW SECTION ===== */}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
