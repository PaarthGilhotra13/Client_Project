import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { Link } from "react-router-dom"
import { ScaleLoader } from "react-spinners"

export default function EmployeeDashboard() {
    var [profile, setProfile] = useState([])
    var [tasks, setTasks] = useState([])
    var [load, setLoad] = useState(true)
    var empId = sessionStorage.getItem("empId")
    useEffect(() => {
        const id = sessionStorage.getItem("userId")
        let data = {
            userId: id
        }
        ApiServices.GetAllEmployee(data)
            .then((res) => {
                setProfile(res?.data?.data[0])
                sessionStorage.setItem("empId", res?.data?.data[0]?._id)
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
            })
            .catch((err) => {
                console.log("Error is ", err);
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
            })

    }, [])
    useEffect(() => {
        let data = {
            employeeId: empId
        }
        ApiServices.GetAllTask(data)
            .then((res) => {
                setTasks(res && res.data && res.data.data ? res.data.data : []);
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
            })
            .catch((err) => {
                console.log("Error fetching tasks:", err);
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
            });

    }, []);
    const today = new Date();
    const missedDeadlines = tasks.filter(task => {
        const deadlineDate = new Date(task.deadline);
        return task.progress !== "Completed" && deadlineDate < today;
    }).length;
    const total = tasks.length;
    const completed = tasks.filter((t) => t.progress === "Completed").length;
    const inProgress = tasks.filter((t) => t.progress === "In Progress").length;


    const upcomingTasks = tasks
        .filter(task => {
            const deadlineDate = new Date(task.deadline);
            return task.progress !== "Completed" && deadlineDate > today;
        })
    return (
        <>
            <main id="main" className="main">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className={load ? "display-screen" : ""}>
                    <div className="container-fluid my-4">
                        <h3 style={{ color: "#012970" }}> <strong>Welcome back, {profile.name}!</strong></h3>

                        <div className="row justify-content-center mt-4">
                            {/* Assigned Tasks */}
                            <div className="col-xxl-4 col-md-6 mb-4 ">
                                <div className="card info-card">
                                    <div className="card-body mb-4 position-relative">
                                        <h5 className="card-title">Assigned Tasks</h5>
                                        <div className="d-flex align-items-center mt-4">
                                            <div
                                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#4B49AC',
                                                }}
                                            >
                                                <i className="bi bi-kanban-fill fs-4" />
                                            </div>
                                            <div>
                                                <h6 className="card-title mb-0">{total}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className="col-xxl-4 col-md-6 mb-4">
                                <div className="card info-card">
                                    <div className="card-body mb-4 position-relative">
                                        <h5 className="card-title">In Progress</h5>
                                        <div className="d-flex align-items-center mt-4">
                                            <div
                                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#FFA500',
                                                }}
                                            >
                                                <i className="bi bi-clock-history fs-4" />
                                            </div>
                                            <div>
                                                <h6 className="card-title mb-0">{inProgress}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Completed Tasks */}
                            <div className="col-xxl-4 col-md-6 mb-4">
                                <div className="card info-card">
                                    <div className="card-body mb-4 position-relative">
                                        <h5 className="card-title">Completed Tasks</h5>
                                        <div className="d-flex align-items-center mt-4">
                                            <div
                                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#28A745',
                                                }}
                                            >
                                                <i className="bi bi-check-circle-fill fs-4" />
                                            </div>
                                            <div>
                                                <h6 className="card-title mb-0">{completed}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Coins */}
                            <div className="col-xxl-4 col-md-6 mb-4">
                                <div className="card info-card">
                                    <div className="card-body mb-4 position-relative">
                                        <h5 className="card-title">Earned Coins</h5>
                                        <div className="d-flex align-items-center mt-4">
                                            <div
                                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#FFC107',
                                                }}
                                            >
                                                <i className="bi bi-coin fs-4" />
                                            </div>
                                            <div>
                                                <h6 className="card-title mb-0">{profile.coins}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="col-xxl-4 col-md-6 mb-4">
                                <div className="card info-card">
                                    <div className="card-body mb-4 position-relative">
                                        <h5 className="card-title">Experience</h5>
                                        <div className="d-flex align-items-center mt-4">
                                            <div
                                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#17A2B8',
                                                }}
                                            >
                                                <i className="bi bi-bar-chart-fill fs-4" />
                                            </div>
                                            <div>
                                                <h6 className="card-title mb-0">{profile.experience} </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Missed Deadlines */}
                            <div className="col-xxl-4 col-md-6 mb-4">
                                <div className="card info-card">
                                    <div className="card-body mb-4 position-relative">
                                        <h5 className="card-title">Missed Deadlines</h5>
                                        <div className="d-flex align-items-center mt-4">
                                            <div
                                                className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#DC3545',
                                                }}
                                            >
                                                <i className="bi bi-exclamation-circle fs-4" />
                                            </div>
                                            <div>
                                                <h6 className="card-title mb-0">{missedDeadlines}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-lg-12 mt-5 table-responsive">
                                <h5>Upcoming Deadlines</h5>
                                <table className="table table-hover table-responsive table-striped mt-4">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Task Title</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                            <th>Progress</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcomingTasks.length > 0 ? (
                                            upcomingTasks.map((el, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.title}</td>
                                                    <td>{el.status ? "True" : "False"}</td>
                                                    <td>{new Date(el.deadline).toLocaleDateString()}</td>
                                                    <td>{el.progress}</td>
                                                    <td>
                                                        <Link to={"/employee/viewTaskDetails/" + el._id} className="btn btn-success">
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-muted text-center">No upcoming tasks</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

        </>
    )
}