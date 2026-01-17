import { Link } from "react-router-dom";
export default function FmSidebar() {
  const handleSidebarClose = () => {
    if (window.innerWidth <= 1024) {
      document.body.classList.remove("toggle-sidebar"); // if you're toggling class on body
      document.getElementById("sidebar").classList.remove("active"); // if you're toggling class on sidebar
    }
  };
  return (
    <>
      {/* ======= Sidebar ======= */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav" style={{ cursor: "default" }}>
          {/* Start Dashboard Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/fm"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-grid" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/fm/viewAnnouncement"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-megaphone" />
              <span>Announcement</span>
            </Link>
          </li>
          {/* End Dashboard Nav */}

          {/* Start Add Expenses Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/fm/addExpenses"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-plus" />
              <span>Add Expenses</span>
            </Link>
          </li>
          {/* End Add Expenses Nav */}
          {/* Start My Expenses Nav */}
          <li className="nav-item">
            <Link
              className="nav-link collapsed"
              data-bs-target="#my-expense-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-wallet2" />
              <span>My Expenses</span>
              <i className="bi bi-chevron-down ms-auto" />
            </Link>

            <ul
              id="my-expense-nav"
              className="nav-content collapse show"
            >
              <li>
                <Link to="/fm/myExpenses/pending">
                  <i className="bi bi-clock fs-6" />
                  <span>Pending</span>
                </Link>
              </li>

              <li>
                <Link to="/fm/myExpenses/approved">
                  <i className="bi bi-check-circle fs-6" />
                  <span>Approved</span>
                </Link>
              </li>

              <li>
                <Link to="/fm/myExpenses/hold">
                  <i className="bi bi-pause-circle fs-6" />
                  <span>Hold</span>
                </Link>
              </li>

              <li>
                <Link to="/fm/myExpenses/declined">
                  <i className="bi bi-x-circle fs-6" />
                  <span>Declined</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* End My Expenses Nav */}
          {/* <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/employee/dailyProgress"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-clipboard-check" />
              <span>History</span>
            </Link>
          </li> */}
          {/* <li className="nav-item">
            <Link
              className="nav-link collapsed"
              to={"/employee/myProfile"}
              onClick={handleSidebarClose}
            >
              <i className="bi bi-person" />
              <span>My Profile</span>
            </Link>
          </li> */}
        </ul>
      </aside>
      {/* End Sidebar*/}
    </>
  );
}
