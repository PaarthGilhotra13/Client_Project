import { Link, useLocation } from 'react-router-dom';
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
                        <Link className="nav-link collapsed" to={"/admin"} onClick={handleSidebarClose}>
                            <i className="bi bi-grid" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    {/* End Dashboard Nav */}
                    {/* Start Dashboard Nav */}
                    {/* <li className="nav-item">
                        <Link className="nav-link collapsed" to={"/admin/announcement"} onClick={handleSidebarClose}>
                            <i className="bi bi-megaphone" />
                            <span>Announcement</span>
                        </Link>
                    </li> */}
                    {/* End Dashboard Nav */}
                    {/* Start Category Nav */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#category-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-folder" />
                            <span>Department</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="category-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addDepartment"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Department</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageDepartment"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Department</span>
                                </Link>
                            </li>


                        </ul>
                    </li> */}
                    {/* End Category Nav */}
                    {/* Start SubCategory Nav */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#subcategory-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-code-slash" />
                            <span>Technology</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="subcategory-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addTechnology"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Technology</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageTechnology"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Technology</span>
                                </Link>
                            </li>


                        </ul>
                    </li> */}
                    {/* End SubCategory Nav */}
                    {/* Start Project Nav */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#project-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-graph-up" />
                            <span>Project</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="project-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addProject"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Project</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageProject"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Project</span>
                                </Link>
                            </li>


                        </ul>
                    </li> */}
                    {/* End Project Nav */}

                    {/* Start Project team Nav */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#projectTeam-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-people" />
                            <span>Project Team</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="projectTeam-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addProjectTeam"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Team</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageProjectTeam"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Team</span>
                                </Link>
                            </li>


                        </ul>
                    </li> */}
                    {/* End Project team Nav */}
                    {/* Start Employee Nav */}
                    <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#employee-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-person-vcard" />
                            <span>Employee</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="employee-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addEmployee"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Employee</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageEmployee"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Employee</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/BlockedEmployee"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Blocked Employee</span>
                                </Link>
                            </li>


                        </ul>
                    </li>
                    {/* End Employee Nav */}
                    {/* Start Task Nav */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#task-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-card-checklist" />
                            <span>Task</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="task-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addTask"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Task</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageTask"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Task</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/viewProgress"} onClick={handleSidebarClose}>
                                    <i className="bi bi-file-earmark-text fs-6" />
                                    <span>View Progress</span>
                                </Link>
                            </li>

                        </ul>
                    </li> */}
                    {/* End Task Nav */}
                    {/* Start Coins Nav */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            data-bs-target="#coins-nav"
                            data-bs-toggle="collapse"

                        >
                            <i className="bi bi-coin" />
                            <span>Coins</span>
                            <i className="bi bi-chevron-down ms-auto" />
                        </Link>
                        <ul
                            id="coins-nav"
                            className="nav-content collapse "
                            data-bs-parent="#sidebar-nav"
                        >
                            <li>
                                <Link to={"/admin/addCoins"} onClick={handleSidebarClose}>
                                    <i className="bi bi-plus fs-5" />
                                    <span>Add Coins</span>

                                </Link>
                            </li>
                            <li>
                                <Link to={"/admin/manageCoins"} onClick={handleSidebarClose}>
                                    <i className="bi bi-card-list fs-6" />
                                    <span>Manage Coins</span>
                                </Link>
                            </li>

                        </ul>
                    </li> */}
                </ul>
            </aside>
            {/* End Sidebar*/}
        </>
    );
}