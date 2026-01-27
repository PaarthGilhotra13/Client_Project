import PageTitle from "../../PageTitle";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AllPendingExpense() {
  const [complaints, setComplaints] = useState([
    {
      _id: "CMP001",
      employeeName: "Rahul Sharma",
      subject: "Salary Issue",
      description: "Salary not credited for March",
      attachment: "",
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
      comment: "",
      createdAt: "2025-01-11T12:15:00",
    },
    {
      _id: "CMP003",
      employeeName: "Neha Singh",
      subject: "Work Pressure",
      description: "Excessive workload",
      attachment: "",
      status: "Declined",
      comment: "",
      createdAt: "2025-01-12T09:45:00",
    },
  ]);

  const [activeMenu, setActiveMenu] = useState(null); // which complaint's menu is open

  // Function to update complaint status and comment
  const updateComplaint = (id, newStatus) => {
    Swal.fire({
      title: `Change status to "${newStatus}"`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: "Enter comment...",
      inputValue: complaints.find((c) => c._id === id)?.comment || "",
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value || "";
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

  return (
    <main className="main" id="main">
      <PageTitle child="View Request" />

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
                <th>Action</th>
                <th>Comment</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>{c._id}</td>
                  <td>{c.employeeName}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>{c.subject}</td>
                  <td>{c.description}</td>
                  <td>{c.attachment ? "View" : "N/A"}</td>
                  <td>
                    <div className="dropdown" style={{cursor: "default"}}>
                      <span
                        style={{ cursor: "pointer", fontSize: "18px" }}
                        onClick={() =>
                          setActiveMenu(activeMenu === c._id ? null : c._id)
                        }
                      >
                        &#x22EE; {/* 3-dot menu */}
                      </span>

                      {activeMenu === c._id && (
                        <ul
                          className="dropdown-menu show"
                          style={{ position: "absolute", zIndex: 1000 }}
                        >
                          {["Approved", "Hold", "Declined"].map((statusOption) => (
                            <li key={statusOption}>
                              <button
                                className="dropdown-item"
                                onClick={() => updateComplaint(c._id, statusOption)}
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
