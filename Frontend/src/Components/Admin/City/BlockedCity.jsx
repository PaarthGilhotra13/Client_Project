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

    useEffect(() => {
        ApiServices.GetAllCity()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res.data.data);
                } else {
                    setData([]);
                }
                setLoad(false);
            })
            .catch(() => setLoad(false));
    }, []);

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
                                navigate("/admin/manageCity");
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
        <main className="main" id="main">

            <PageTitle child="Blocked City" />

            {load &&
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                />
            }

            {!load &&
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12 mt-4 table-responsive">

                            <table className="table table-hover table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Zone</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data
                                        ?.filter(el => el.status === false)
                                        ?.map((el, index) => (
                                            <tr key={el?._id}>
                                                <td>{index + 1}</td>
                                                <td>{el?.cityName}</td>
                                                <td>{el?.stateId?.stateName}</td>
                                                <td>{el?.zoneId?.zoneName}</td>
                                                <td>
                                                    <span className="badge bg-danger">
                                                        Blocked
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => changeActiveStatus(el?._id)}
                                                    >
                                                        <i className="bi bi-check-circle"></i> Unblock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            }
        </main>
    );
}
