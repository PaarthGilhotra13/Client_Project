import { useState } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";

export default function AllHoldExpense() {
  const [complaints, setComplaints] = useState([
    {
      _id: "CMP001",
      employeeName: "Rahul Sharma",
      subject: "Salary Issue",
      description: "Salary not credited for March",
      attachment: "https://example.com/salary-slip.pdf",
      status: "Hold",
      comment: "",
      createdAt: "2025-01-10T10:30:00",
    },
    {
      _id: "CMP002",
      employeeName: "Amit Verma",
      subject: "Leave Issue",
      description: "Leave not approved",
      attachment: "",
      status: "Approved",
      comment: "Approved by HR",
      createdAt: "2025-01-11T12:15:00",
    },
    {
      _id: "CMP003",
      employeeName: "Neha Singh",
      subject: "Work Pressure",
      description: "Excessive workload",
      attachment: "",
      status: "Hold",
      comment: "",
      createdAt: "2025-01-12T09:45:00",
    },
  ]);

  const [activeMenu, setActiveMenu] = useState(null); // which complaint's menu is open

  // Handle status update with comment
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
            c._id === id ? { ...c, status: newStatus, comment } : c
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

  // Only Hold complaints
  const holdComplaints = complaints.filter((c) => c.status === "Hold");

  return (
    <main className="main" id="main">
      <PageTitle child="Hold Requests" />

      <div className="container-fluid mt-3" style={{cursor: "default"}}>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sr No</th>
                <th>Complaint ID</th>
                <th>Employee Name</th>
                <th>Date & Time</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Attachment</th>
                <th>Status / Action</th>
                <th>Comment</th>
              </tr>
            </thead>

            <tbody>
              {holdComplaints.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Hold Complaints Found
                  </td>
                </tr>
              )}

              {holdComplaints.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>{c._id}</td>
                  <td>{c.employeeName}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>{c.subject}</td>
                  <td>{c.description}</td>
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
                        className={`badge bg-warning text-dark`}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setActiveMenu(activeMenu === c._id ? null : c._id)
                        }
                      >
                        {c.status} &#x22EE;
                      </span>

                      {activeMenu === c._id && (
                        <ul
                          className="dropdown-menu show"
                          style={{ position: "absolute", zIndex: 1000 }}
                        >
                          {["Approved", "Declined"].map((statusOption) => (
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
                          ))}
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
    </main>
  );
}
