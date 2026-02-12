import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function AllPendingExpense() {
  const [complaints, setComplaints] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [load, setLoad] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoad(true);
    try {
      const res = await ApiServices.GetAllExpense();
      const allExpenses = res?.data?.data || [];

      // ✅ Filter only Pending
      const pendingExpenses = allExpenses.filter(
        (e) => e.currentStatus === "Pending"
      );

      // 💰 Total Pending Amount
      const amountSum = pendingExpenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      );

      setComplaints(pendingExpenses);
      setTotalAmount(amountSum);

    } catch (err) {
      console.log(err);
    } finally {
      setLoad(false);
    }
  };

  const updateComplaint = (id, newStatus) => {
    Swal.fire({
      title: `Change status to "${newStatus}"`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: "Enter comment...",
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value || "";

        setComplaints((prev) =>
          prev.map((c) =>
            c._id === id
              ? { ...c, currentStatus: newStatus, comment }
              : c
          )
        );

        setActiveMenu(null);

        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Pending Requests" />

      {load && (
        <div className="text-center mt-4">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <div className="container-fluid mt-3">

          {/* 💰 TOTAL PENDING AMOUNT */}
          <div className="mb-3">
            <h5 className="fw-bold">
              Total Pending Amount :
              <span className="text-warning ms-2">
                ₹ {totalAmount.toLocaleString()}
              </span>
            </h5>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Ticket ID</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Attachment</th>
                  <th>Action</th>
                  <th>Comment</th>
                </tr>
              </thead>

              <tbody>
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Pending Expenses Found
                    </td>
                  </tr>
                )}

                {complaints.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.ticketId || "-"}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                    <td>₹ {Number(c.amount || 0).toLocaleString()}</td>
                    <td>
                      {c.attachment ? (
                        <a href={c.attachment} target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <div className="dropdown">
                        <span
                          style={{ cursor: "pointer", fontSize: "18px" }}
                          onClick={() =>
                            setActiveMenu(activeMenu === c._id ? null : c._id)
                          }
                        >
                          &#x22EE;
                        </span>

                        {activeMenu === c._id && (
                          <ul
                            className="dropdown-menu show"
                            style={{ position: "absolute", zIndex: 1000 }}
                          >
                            {["Approved", "Hold", "Rejected"].map(
                              (statusOption) => (
                                <li key={statusOption}>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      updateComplaint(c._id, statusOption)
                                    }
                                  >
                                    {statusOption}
                                  </button>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td>{c.comment || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
