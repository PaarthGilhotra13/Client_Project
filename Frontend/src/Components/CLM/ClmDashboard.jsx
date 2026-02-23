import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function CLMDashboard() {
  const userId = sessionStorage.getItem("userId");

  const [load, setLoad] = useState(false);
  const [counts, setCounts] = useState({
    pendingApprovals: 0,
    hold: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!userId) return;

    setLoad(true);

    Promise.all([
      // 🔵 PENDING at CLM (NEW API)
      ApiServices.GetClmPendingExpenses({ userId }),

      // 🟡 HOLD by CLM
      ApiServices.MyApprovalActions({
        userId,
        action: "Hold",
        level: "CLM",
      }),

      // 🟢 APPROVED by CLM
      ApiServices.MyApprovalActions({
        userId,
        action: "Approved",
        level: "CLM",
      }),

      // 🔴 REJECTED by CLM
      ApiServices.MyApprovalActions({
        userId,
        action: "Rejected",
        level: "CLM",
      }),
    ])
      .then(([pendingRes, holdRes, approvedRes, rejectedRes]) => {
        console.log("CLM PENDING 👉", pendingRes?.data?.data);
        console.log("CLM HOLD 👉", holdRes?.data?.data);
        console.log("CLM APPROVED 👉", approvedRes?.data?.data);
        console.log("CLM REJECTED 👉", rejectedRes?.data?.data);

        setCounts({
          pendingApprovals: pendingRes?.data?.data?.length || 0,
          hold: holdRes?.data?.data?.length || 0,
          approved: approvedRes?.data?.data?.length || 0,
          rejected: rejectedRes?.data?.data?.length || 0,
        });

        setLoad(false);
      })
      .catch((err) => {
        console.log("❌ CLM DASHBOARD ERROR", err);
        setLoad(false);
      });
  }, [userId]);

  return (
    <main id="main" className="main" style={{ position: "relative" }}>
      {load && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      <div className="container-fluid my-4">
        <h3 style={{ color: "#012970" }}>
          <strong>Cluster Level Manager Dashboard</strong>
        </h3>

        <div className="row mt-4 g-3">
          <Card
            title="Pending Approvals"
            value={counts.pendingApprovals}
            color="#17A2B8"
            icon="bi-hourglass-split"
            link="/clm/pendingExpenses"
          />

          <Card
            title="Hold Requests"
            value={counts.hold}
            color="#6c757d"
            icon="bi-pause-circle-fill"
            link="/clm/holdExpenses"
          />

          <Card
            title="Approved"
            value={counts.approved}
            color="#28A745"
            icon="bi-check-circle-fill"
            link="/clm/approvedExpenses"
          />

          <Card
            title="Rejected"
            value={counts.rejected}
            color="#DC3545"
            icon="bi-x-circle-fill"
            link="/clm/rejectedExpenses"
          />
        </div>
      </div>
    </main>
  );
}

/* 🔹 CARD – UI UNCHANGED */
function Card({ title, value, color, icon, link }) {
  return (
    <div className="col-6 col-md-6 col-xl-4">
      <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="card info-card h-100">
          <div className="card-body mb-4">
            <h5 className="card-title">{title}</h5>
            <div className="d-flex align-items-center mt-4">
              <div
                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: 50, height: 50, backgroundColor: color }}
              >
                <i className={`bi ${icon} fs-4`} />
              </div>
              <h6 className="fw-bold mb-0">{value}</h6>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
