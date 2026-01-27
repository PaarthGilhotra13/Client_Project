// import { useState } from "react";
// import PageTitle from "../../PageTitle";

// export default function ApprovedExpenses() {
//   const [complaints] = useState([
//     {
//       _id: "CMP001",
//       employeeName: "Rahul Sharma",
//       subject: "Salary Issue",
//       description: "Salary not credited for March",
//       attachment: "https://example.com/salary-slip.pdf",
//       status: "Approved",
//       comment: "Approved by HR",
//       createdAt: "2025-01-10T10:30:00",
//     },
//     {
//       _id: "CMP002",
//       employeeName: "Amit Verma",
//       subject: "Leave Issue",
//       description: "Leave not approved",
//       attachment: "",
//       status: "Approved",
//       comment: "Leave approved",
//       createdAt: "2025-01-11T12:15:00",
//     },
//     {
//       _id: "CMP003",
//       employeeName: "Neha Singh",
//       subject: "Work Pressure",
//       description: "Excessive workload",
//       attachment: "",
//       status: "Hold",
//       comment: "",
//       createdAt: "2025-01-12T09:45:00",
//     },
//   ]);

//   // Filter only Approved complaints
//   const approvedComplaints = complaints.filter((c) => c.status === "Approved");

//   return (
//     <main className="main" id="main">
//       <PageTitle child="Approved Requests" />

//       <div className="container-fluid mt-3" style={{ cursor: "default" }}>
//         <div className="table-responsive">
//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>Sr No</th>
//                 <th>Complaint ID</th>
//                 <th>Employee Name</th>
//                 <th>Date & Time</th>
//                 <th>Subject</th>
//                 <th>Description</th>
//                 <th>Attachment</th>
//                 <th>Status</th>
//                 <th>Comment</th>
//               </tr>
//             </thead>

//             <tbody>
//               {approvedComplaints.length === 0 && (
//                 <tr>
//                   <td colSpan="9" className="text-center">
//                     No Approved Complaints Found
//                   </td>
//                 </tr>
//               )}

//               {approvedComplaints.map((c, index) => (
//                 <tr key={c._id}>
//                   <td>{index + 1}</td>
//                   <td>{c._id}</td>
//                   <td>{c.employeeName}</td>
//                   <td>{new Date(c.createdAt).toLocaleString()}</td>
//                   <td>{c.subject}</td>
//                   <td>{c.description}</td>
//                   <td>
//                     {c.attachment ? (
//                       <a
//                         href={c.attachment}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-primary btn-sm"
//                       >
//                         View
//                       </a>
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td>
//                     <span className="badge bg-success">{c.status}</span>
//                   </td>
//                   <td>{c.comment || "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </main>
//   );
// }
import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function AllApprovedExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH APPROVED EXPENSES ================= */
  const fetchApproved = () => {
    setLoad(true);

    ApiServices.AdminExpensesByStatus({
      status: "Approved",
    })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setLoad(false);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load approved expenses", "error");
        setLoad(false);
      });
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  /* ================= MODAL ================= */
  const handleView = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Approved Expenses (Admin)" />

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {/* ================= TABLE ================= */}
      {!load && (
        <div className="container-fluid mt-3">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Ticket ID</th>
                  <th>Store</th>
                  <th>Expense Head</th>
                  <th>Amount</th>
                  <th>Approved By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((e, index) => (
                    <tr key={e._id || index}>
                      <td>{index + 1}</td>
                      <td>{e.ticketId}</td>
                      <td>{e.storeId?.storeName || "-"}</td>
                      <td>{e.expenseHeadId?.name || "-"}</td>
                      <td>₹ {e.amount}</td>

                      {/* ✅ ONLY NEW THING */}
                      <td>
                        {e.actionBy} ({e.actionLevel})
                      </td>

                      <td>
                        <span className="badge bg-success">Approved</span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleView(e)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No Approved Expenses Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL (UNCHANGED UI) ================= */}
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
                  onClick={handleClose}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body px-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Ticket ID:</strong>
                    <p>{selectedExpense.ticketId}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Status:</strong>
                    <p>
                      <span className="badge bg-success">Approved</span>
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Store:</strong>
                    <p>{selectedExpense.storeId?.storeName || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Expense Head:</strong>
                    <p>{selectedExpense.expenseHeadId?.name || "-"}</p>
                  </div>

                  <div className="col-md-6">
                    <strong>Amount:</strong>
                    <p>₹ {selectedExpense.amount}</p>
                  </div>

                  {/* ✅ ONLY ADDITION */}
                  <div className="col-md-6">
                    <strong>Approved By:</strong>
                    <p>
                      {selectedExpense.actionBy} (
                      {selectedExpense.actionLevel})
                    </p>
                  </div>

                  <div className="col-md-6">
                    <strong>Approved On:</strong>
                    <p>
                      {selectedExpense.actionAt
                        ? new Date(
                          selectedExpense.actionAt
                        ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  {/* ATTACHMENTS (UNCHANGED) */}
                  <div className="col-12">
                    <strong>Attachment:</strong>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
