import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function AdminHeader() {
  const [load, setLoad] = useState(false);
  const nav = useNavigate();

  /* 🔔 DUMMY NOTIFICATIONS */
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Employee Added",
      message: "A new employee has been added to the system.",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Leave Request",
      message: "Rahul has applied for leave.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "System Alert",
      message: "Server maintenance scheduled at 10 PM.",
      time: "Yesterday",
      read: true,
    },
  ]);

  const [showNotifyPanel, setShowNotifyPanel] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedNotify, setSelectedNotify] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addSidebar = () => {
    document.body.classList.toggle("toggle-sidebar");
  };

  function logoutfun() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logout !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        nav("/");
      }
    });
  }

  return (
    <>
      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {/* HEADER */}
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/employee" className="logo d-flex align-items-center ms-3">
            <img src="/assets/img/logo4.png" alt="" />
            <span className="d-lg-block">R&M Tool</span>
          </Link>
          <i className="bi bi-list toggle-sidebar-btn" onClick={addSidebar} />
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            {/* 🔔 Notification Bell */}
            <li className="nav-item pe-3">
              <span
                className="nav-link position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => setShowNotifyPanel(true)}
              >
                <i className="bi bi-bell fs-5"></i>

                {unreadCount > 0 && (
                  <span className="notify-badge">{unreadCount}</span>
                )}
              </span>
            </li>

            {/* 👤 Profile */}
            <li className="nav-item dropdown pe-3">
              <Link
                className="nav-link nav-profile d-flex align-items-center pe-0"
                data-bs-toggle="dropdown"
              >
                <img
                  src="/assets/img/admin_Profile.png"
                  className="rounded-circle"
                />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  Admin
                </span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end profile">
                <li className="dropdown-header">
                  <h6>Admin</h6>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    to="/admin/myProfile"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-person" />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <span
                    onClick={logoutfun}
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-box-arrow-right" />
                    <span>Logout</span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      {/* 👉 RIGHT SIDE NOTIFICATION PANEL */}
      {showNotifyPanel && (
        <div className="notification-panel">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">Notifications</h5>
            <i
              className="bi bi-x-lg"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNotifyPanel(false)}
            ></i>
          </div>

          <ul className="list-group list-group-flush">
            {notifications.map((item) => (
              <li
                key={item.id}
                className={`list-group-item list-group-item-action 
                                    ${item.read ? "" : "fw-bold"}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedNotify(item);
                  setShowNotifyModal(true);

                  // mark as read (dummy)
                  setNotifications((prev) =>
                    prev.map((n) =>
                      n.id === item.id ? { ...n, read: true } : n,
                    ),
                  );
                }}
              >
                <div className="d-flex justify-content-between">
                  <span>{item.title}</span>
                  <small className="text-muted">{item.time}</small>
                </div>
                <p className="mb-0 small text-muted">{item.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 👉 MODAL + BLUR */}
      {showNotifyModal && (
        <>
          <div className="blur-overlay"></div>
          <div className="notify-modal">
            <h5>{selectedNotify?.title}</h5>
            <p className="mt-3">{selectedNotify?.message}</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowNotifyModal(false)}
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}
