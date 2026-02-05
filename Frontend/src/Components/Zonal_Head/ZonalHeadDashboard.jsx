import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { Link } from "react-router-dom";

export default function ZonalHeadDashboard() {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({
    assignedRequests: 0,
    inProcess: 0,
    pendingApprovals: 0,
    approved: 0,
    rejected: 0,
    missedDeadlines: 0,
  });

  useEffect(() => {
    setLoad(true);
    ApiServices.ZonalHeadDashboard()
      .then((res) => {
        const d = res?.data?.data || {};

        setData({
          assignedRequests: d.assignedRequests ?? 0,
          inProcess: d.inProcess ?? 0,
          pendingApprovals: d.pendingApprovals ?? 0,
          approved: d.approved ?? 0,
          rejected: d.rejected ?? 0,
          missedDeadlines: d.missedDeadlines ?? 0,
        });

        setLoad(false);
      })
      .catch(() => {
        setLoad(false);
      });
  }, []);

  const cards = [
    {
      title: "Assigned Requests",
      value: data.assignedRequests,
      color: "#4B49AC",
      icon: "bi-inbox",
      link: "/zonalHead/assignedRequests",
    },
    {
      title: "In Process",
      value: data.inProcess,
      color: "#FDA403",
      icon: "bi-arrow-repeat",
      link: "/zonalHead/inProcess",
    },
    {
      title: "Pending Approvals",
      value: data.pendingApprovals,
      color: "#00B8D9",
      icon: "bi-hourglass-split",
      link: "/zonalHead/pendingApprovals",
    },
    {
      title: "Approved",
      value: data.approved,
      color: "#20C997",
      icon: "bi-check-circle",
      link: "/zonalHead/approved",
    },
    {
      title: "Rejected",
      value: data.rejected,
      color: "#FF6B6B",
      icon: "bi-x-circle",
      link: "/zonalHead/rejected",
    },
    {
      title: "Missed Deadlines",
      value: data.missedDeadlines,
      color: "#DC3545",
      icon: "bi-exclamation-triangle",
      link: "/zonalHead/missedDeadlines",
    },
  ];

  return (
    <main id="main" className="main">
      <PageTitle child="Zonal Head Dashboard" />

      {load && (
        <div className="container-fluid text-center mt-5">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <div className="row">
          {cards.map((card, i) => (
            <div key={i} className="col-xxl-4 col-md-6 mb-4">
              <Link
                to={card.link}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card info-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>

                    <div className="d-flex align-items-center">
                      <div
                        className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: 50,
                          height: 50,
                          background: card.color,
                        }}
                      >
                        <i className={`bi ${card.icon} fs-4`} />
                      </div>
                      <h6 className="mb-0 fw-bold">{card.value}</h6>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
