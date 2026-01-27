import { useState } from "react";
import PageTitle from "../../PageTitle";

export default function AllRjectedExpense() {
  const [complaints] = useState([
    {
      _id: "CMP001",
      employeeName: "Rahul Sharma",
      subject: "Salary Issue",
      description: "Salary not credited for March",
      attachment: "https://example.com/salary-slip.pdf",
      status: "Declined",
      comment: "Salary issue not valid",
      createdAt: "2025-01-10T10:30:00",
    },
    {
      _id: "CMP002",
      employeeName: "Amit Verma",
      subject: "Leave Issue",
      description: "Leave not approved",
      attachment: "",
      status: "Declined",
      comment: "Leave quota exceeded",
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

  // Filter only Declined complaints
  const declinedComplaints = complaints.filter((c) => c.status === "Declined");

  return (
    <main className="main" id="main">
      <PageTitle child="Declined Requests" />

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
                <th>Status</th>
                <th>Comment</th>
              </tr>
            </thead>

            <tbody>
              {declinedComplaints.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Declined Complaints Found
                  </td>
                </tr>
              )}

              {declinedComplaints.map((c, index) => (
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
                    <span className="badge bg-danger">{c.status}</span>
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
