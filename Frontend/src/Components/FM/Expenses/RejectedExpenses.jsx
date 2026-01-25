import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function RejectedExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  /* ================= FETCH REJECTED EXPENSES ================= */
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyExpenses({ userId, currentStatus: "Rejected" })
      .then((res) => {
        setData(res?.data?.success ? res.data.data || [] : []);
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
    Status: "Rejected",
    CreatedAt: new Date(el.createdAt).toLocaleDateString(),
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

  return (
    <main className="main" id="main">
      <PageTitle child="Rejected Expenses" />

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
                filename="Rejected_Expenses.csv"
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
                          <span className="badge bg-danger">Rejected</span>
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
                      <td colSpan={8} className="text-center text-muted">
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
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Expense Details</h5>
                <button className="btn-close" onClick={handleCloseModal} />
              </div>

              <div className="modal-body px-4">
                <p><strong>Ticket ID:</strong> {selectedExpense.ticketId}</p>
                <p><strong>Store:</strong> {selectedExpense.storeId?.storeName}</p>
                <p><strong>Expense Head:</strong> {selectedExpense.expenseHeadId?.name}</p>
                <p><strong>Amount:</strong> ₹ {selectedExpense.amount}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-danger">Rejected</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
