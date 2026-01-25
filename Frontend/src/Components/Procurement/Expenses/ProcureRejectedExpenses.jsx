import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";

export default function ProcureRejectedExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
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
      level: "PROCUREMENT",
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
      el.expenseId?.ticketId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      el.expenseId?.storeId?.storeName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      el.expenseId?.expenseHeadId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
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
    Comment: el.comment || "",
    RejectedOn: new Date(el.actionAt).toLocaleDateString(),
  }));

  return (
    <main className="main" id="main">
      <PageTitle child="Rejected Expenses (Procurement)" />

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
                filename="Procurement_Rejected_Expenses.csv"
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
                    <th>Rejected On</th>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
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
    </main>
  );
}
