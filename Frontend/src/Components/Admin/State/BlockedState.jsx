import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function BlockedState() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        ApiServices.GetAllState()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res.data.data || []);
                } else {
                    setData([]);
                }
                setTimeout(() => setLoad(false), 500);
            })
            .catch(() => {
                setData([]);
                setTimeout(() => setLoad(false), 500);
            });
    }, [load]);

    const blockedStates = data.filter((el) => el.status === false);

    function changeActiveStatus(id) {
        Swal.fire({
            title: "Unblock State?",
            text: "Do you want to unblock this state?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Unblock",
        }).then((result) => {
            if (result.isConfirmed) {
                ApiServices.ChangeStatusState({ _id: id, status: true })
                    .then((res) => {
                        if (res?.data?.success) {
                            Swal.fire({
                                icon: "success",
                                title: res.data.message,
                                showConfirmButton: false,
                                timer: 1200,
                            });
                            setLoad(true);
                        } else {
                            Swal.fire("Error", res?.data?.message, "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Something went wrong!", "error");
                    });
            }
        });
    }

    return (
        <>
            <main className="main" id="main">
                <PageTitle child="Blocked State" />

                <div className="container-fluid">
                    <ScaleLoader
                        color="#6776f4"
                        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                        size={200}
                        loading={load}
                    />
                </div>

                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mt-5 table-responsive">
                            {!load && (
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Zone</th>
                                            <th>State</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blockedStates.length ? (
                                            blockedStates.map((el, index) => (
                                                <tr key={el._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.zoneId?.zoneName || "-"}</td>
                                                    <td>{el.stateName}</td> {/* ✅ STRING */}
                                                    <td>
                                                        <span className="badge bg-danger">Blocked</span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn"
                                                            style={{ background: "#198754", color: "white" }}
                                                            onClick={() => changeActiveStatus(el._id)}
                                                        >
                                                            <i className="bi bi-check-circle"></i> Unblock
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted">
                                                    No Blocked State Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
