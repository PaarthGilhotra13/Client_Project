import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function ProcureHoldExpense() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH HOLD ================= */
  const fetchHold = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyApprovalActions({
      userId: userId,
      action: "Hold",
      level: "PROCUREMENT", // ✅ IMPORTANT
    })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch(() => {
        setData([]);
        setTimeout(() => setLoad(false), 500);
      });
  };

  useEffect(() => {
    fetchHold();
  }, []);

  const handleViewClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <main className="main" id="main">
        <PageTitle child="Hold Expenses (Procurement)" />

        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          size={200}
          loading={load}
        />

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
                    {data.length > 0 ? (
                      data.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el.expenseId?.ticketId}</td>
                          <td>{el.expenseId?.storeId?.storeName}</td>
                          <td>{el.expenseId?.expenseHeadId?.name}</td>
                          <td>₹ {el.expenseId?.amount}</td>
                          <td>
                            <span className="badge bg-secondary">Hold</span>
                          </td>
                          <td>{el.comment || "-"}</td>
                          <td>
                            {new Date(el.actionAt).toLocaleDateString()}
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
                        <td colSpan="9" className="text-center text-muted">
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
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Expense Details</h5>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "red",
                      color: "white",
                      border: "none",
                    }}
                  >
                    &times;
                  </button>
                </div>

                <div className="modal-body px-4">
                  <p><b>Ticket:</b> {selectedExpense.expenseId?.ticketId}</p>
                  <p><b>Store:</b> {selectedExpense.expenseId?.storeId?.storeName}</p>
                  <p><b>Expense Head:</b> {selectedExpense.expenseId?.expenseHeadId?.name}</p>
                  <p><b>Amount:</b> ₹ {selectedExpense.expenseId?.amount}</p>
                  <p><b>Comment:</b> {selectedExpense.comment || "-"}</p>

                  {selectedExpense.expenseId?.attachment && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        handleDownload(selectedExpense.expenseId.attachment)
                      }
                    >
                      Download Attachment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
