import { Link } from 'react-router-dom';
export default function AdminSidebar() {
    const handleSidebarClose = () => {
        if (window.innerWidth <= 1024) {
            document.body.classList.remove('toggle-sidebar'); // if you're toggling class on body
            document.getElementById("sidebar").classList.remove("active"); // if you're toggling class on sidebar
        }
    }
    return (
        <>
            {/* ======= Sidebar ======= */}
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    {/* Start Dashboard Nav */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/employee"} onClick={handleSidebarClose}>
                            <i className="bi bi-grid" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/employee/viewAnnouncement"} onClick={handleSidebarClose}>
                            <i className="bi bi-megaphone" />
                            <span>Announcement</span>
                        </Link>
                    </li>
                    {/* End Dashboard Nav */}
                    {/* Start Category Nav */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/employee/myProjects"} onClick={handleSidebarClose}>
                            <i className="bi bi-graph-up" />
                            <span>My Projects</span>
                        </Link>
                    </li>
                    {/* End Category Nav */}
                    {/* Start SubCategory Nav */}
                    {/* <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/employee/myProjectTeam"}>
                            <i className="bi bi-people" />
                            <span>My Project Team</span>
                        </Link>
                    </li> */}
                    {/* End SubCategory Nav */}

                    {/* Start Task Nav */}
                    <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#task-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-card-checklist" />
                            <span>My Tasks</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="task-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/employee/myTasks"} onClick={handleSidebarClose}>
                                    <i className="bi bi-list-task fs-5" />
                                    <span>My Task</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/employee/manageTasks"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Task</span>
                                </Link>
                            </li>

                        </ul>
                    </li>
                    {/* End Task Nav */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/employee/dailyProgress"} onClick={handleSidebarClose}>
                            <i className="bi bi-clipboard-check" />
                            <span>Daily Progress</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/employee/myProfile"} onClick={handleSidebarClose}>
                            <i className="bi bi-person" />
                            <span>My Profile</span>
                        </Link>
                    </li>

                </ul>
            </aside>
            {/* End Sidebar*/}
        </>
    );
}