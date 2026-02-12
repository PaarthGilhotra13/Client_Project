import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function AllHoldExpense() {
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

      const holdExpenses = allExpenses.filter(
        (e) => e.currentStatus === "Hold"
      );

      // 💰 Total Hold Amount
      const amountSum = holdExpenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      );

      setComplaints(holdExpenses);
      setTotalAmount(amountSum);

    } catch (err) {
      console.log(err);
    } finally {
      setLoad(false);
    }
  };

  const handleAction = (id, newStatus) => {
    Swal.fire({
      title: `Change status to "${newStatus}"`,
      input: "text",
      inputLabel: "Enter comment (required)",
      inputPlaceholder: "Enter comment...",
      inputValidator: (value) => {
        if (!value.trim()) return "Comment is required";
      },
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value;

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
      <PageTitle child="Hold Requests" />

      {load && (
        <div className="text-center mt-4">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <div className="container-fluid mt-3">

          {/* 💰 TOTAL HOLD AMOUNT */}
          <div className="mb-3">
            <h5 className="fw-bold">
              Total Hold Amount :
              <span className="text-primary ms-2">
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
                  <th>Status / Action</th>
                  <th>Comment</th>
                </tr>
              </thead>

              <tbody>
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Hold Requests Found
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
                        <a
                          href={c.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <div className="dropdown">
                        <span
                          className="badge bg-warning text-dark"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === c._id ? null : c._id
                            )
                          }
                        >
                          {c.currentStatus} &#x22EE;
                        </span>

                        {activeMenu === c._id && (
                          <ul
                            className="dropdown-menu show"
                            style={{ position: "absolute", zIndex: 1000 }}
                          >
                            {["Approved", "Rejected"].map(
                              (statusOption) => (
                                <li key={statusOption}>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleAction(c._id, statusOption)
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
