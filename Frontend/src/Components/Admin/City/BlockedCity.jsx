import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function BlockedCity() {

    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalZone, setModalZone] = useState("");
    const [modalState, setModalState] = useState("");
    const [modalCities, setModalCities] = useState([]);

    useEffect(() => {
        ApiServices.GetAllCity()
            .then(res => {
                if (res?.data?.success) {
                    setData(res.data.data || []);
                }
                setLoad(false);
            })
            .catch(() => setLoad(false));
    }, []);

    /* ✅ ONLY BLOCKED DOCUMENTS */
    const blockedCities = data.filter(el => el.status === false);
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
                ApiServices.ChangeStatusCity({ _id: id, status: true })
                    .then((res) => {
                        if (res?.data?.success) {
                            setLoad(true);
                            Swal.fire({
                                icon: "success",
                                title: res.data.message,
                                showConfirmButton: false,
                                timer: 1200,
                            });
                            setTimeout(()=>{
                                setLoad(false)
                            },1000)

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
            <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
                <PageTitle child="Blocked City" />

                <div className="container-fluid">
                    <ScaleLoader
                        color="#6776f4"
                        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
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
                                            <th>Cities</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {blockedCities.length ? (
                                            blockedCities.map((el, index) => (
                                                <tr key={el._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.zoneId?.zoneName}</td>
                                                    <td>{el?.stateId?.stateName}</td>

                                                    <td>
                                                        <span
                                                            style={{ color: "blue", cursor: "pointer" }}
                                                            onClick={() => {
                                                                setModalZone(el.zoneId?.zoneName);
                                                                setModalState(el?.stateId?.stateName);
                                                                setModalCities(el.cityName);
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            View Cities
                                                        </span>
                                                    </td>

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
                                                    No Blocked City Found
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

            {/* ================= MODAL ================= */}
            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div
                        className="modal-box position-relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 m-2"
                            onClick={() => setModalOpen(false)}
                        ></button>

                        <h5>Zone : <span className="fw-normal">{modalZone}</span></h5>
                        <h6>State : <span className="fw-normal">{modalState}</span></h6>

                        <hr />

                        <h6>Cities</h6>
                        <ul className="ps-3">
                            {modalCities.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
