import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function BlockedCity() {

    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalZone, setModalZone] = useState("");
    const [modalState, setModalState] = useState("");
    const [modalContent, setModalContent] = useState([]);

    useEffect(() => {
        ApiServices.GetAllCity()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res.data.data || []);
                } else {
                    setData([]);
                }
                setLoad(false);
            })
            .catch(() => {
                setData([]);
                setLoad(false);
            });
    }, []);

    /* ================= BLOCKED CITIES ================= */
    const blockedCities = data.filter(el => el.status === false);

    /* ================= GROUP BY ZONE + STATE ================= */
    const groupedData = Object.values(
        blockedCities.reduce((acc, city) => {
            const zoneName = city?.zoneId?.zoneName;
            const stateNames = city?.stateId?.stateName || [];

            if (!Array.isArray(stateNames)) return acc;

            stateNames.forEach((state) => {
                const key = `${zoneName}_${state}`;

                if (!acc[key]) {
                    acc[key] = {
                        zoneName,
                        stateName: state,
                        cities: []
                    };
                }

                acc[key].cities.push(city.cityName);
            });

            return acc;
        }, {})
    );

    function changeActiveStatus(id) {
        Swal.fire({
            title: "Unblock City?",
            text: "Do you want to unblock this city?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Unblock"
        }).then((result) => {
            if (result.isConfirmed) {

                let payload = {
                    _id: id,
                    status: true
                };

                ApiServices.ChangeStatusCity(payload)
                    .then((res) => {
                        if (res?.data?.success) {
                            Swal.fire({
                                icon: "success",
                                title: res.data.message,
                                showConfirmButton: false,
                                timer: 1200
                            });

                            setTimeout(() => {
                                navigate("/admin/blockedCity");
                            }, 1200);
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
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {groupedData.length ? (
                                            groupedData.map((el, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.zoneName}</td>
                                                    <td>{el.stateName}</td>

                                                    <td>
                                                        <span
                                                            style={{ color: "blue", cursor: "pointer" }}
                                                            onClick={() => {
                                                                setModalZone(el.zoneName);
                                                                setModalState(el.stateName);
                                                                setModalContent(el.cities);
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            View Cities
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="badge bg-danger">Blocked</span>
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

                        <h5 className="mb-1">
                            Zone : <span className="fw-normal">{modalZone}</span>
                        </h5>
                        <h6 className="mb-3">
                            State : <span className="fw-normal">{modalState}</span>
                        </h6>

                        <hr />

                        <h6 className="mb-2">Cities</h6>

                        <ul className="ps-3">
                            {modalContent.map((city, index) => (
                                <li key={index}>{city}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
