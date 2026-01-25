import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";

export default function ZhRejectedExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
      level: "ZONAL_HEAD",
    })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
      })
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredData = data.filter(
    (el) =>
      el.expenseId?.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.expenseId?.storeId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.expenseId?.expenseHeadId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
    TicketID: el.expenseId?.ticketId,
    Store: el.expenseId?.storeId?.storeName,
    ExpenseHead: el.expenseId?.expenseHeadId?.name,
    Amount: el.expenseId?.amount,
    Status: "Rejected",
    Comment: el.comment || "-",
    ActionDate: new Date(el.actionAt).toLocaleDateString(),
  }));

  /* ================= MODAL HANDLERS ================= */
  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  /* ================= ATTACHMENT DOWNLOAD ================= */
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Rejected Expenses (Zonal Head)" />

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        size={200}
        loading={load}
      />

      {/* Search + CSV */}
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
                filename="ZH_Rejected_Expenses.csv"
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
                  {currentExpenses.length > 0 ? (
                    currentExpenses.map((el, index) => (
                      <tr key={el._id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{el.expenseId?.ticketId}</td>
                        <td>{el.expenseId?.storeId?.storeName}</td>
                        <td>{el.expenseId?.expenseHeadId?.name}</td>
                        <td>₹ {el.expenseId?.amount}</td>
                        <td>
                          <span className="badge bg-danger">Rejected</span>
                        </td>
                        <td>{el.comment || "-"}</td>
                        <td>{new Date(el.actionAt).toLocaleDateString()}</td>
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
                      <td colSpan="9" className="text-center text-muted">
                        No Rejected Expenses Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

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
                      className={`btn me-1 ${
                        currentPage === i + 1 ? "btn-primary" : "btn-light"
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
          </div>
        </div>
      )}

      {/* Modal */}
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
                    <strong>Status:</strong>
                    <p>
                      <span className="badge bg-danger">Rejected</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Comment:</strong>
                    <p>{selectedExpense.comment || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Action Date:</strong>
                    <p>{new Date(selectedExpense.actionAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-12">
                    <strong>Attachment:</strong>
                    <p>
                      {selectedExpense.expenseId?.attachment ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            handleDownload(selectedExpense.expenseId.attachment)
                          }
                        >
                          Download Attachment
                        </button>
                      ) : (
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
