import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function BlockedStore() {

    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        ApiServices.GetAllStore()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res?.data?.data || []);
                } else {
                    setData([]);
                }
                setLoad(false);
            })
            .catch((err) => {
                console.log("Error is ", err);
                setData([]);
                setLoad(false);
            });
    }, []);

    const blockedStore = data.filter(el => el.status === false);

    function changeActiveStatus(id) {
        Swal.fire({
            title: "Unblock Category?",
            text: "Do you want to unblock this category?",
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

                ApiServices.ChangeStatusStore(payload)
                    .then((res) => {
                        if (res?.data?.success) {
                            Swal.fire({
                                icon: "success",
                                title: res.data.message,
                                showConfirmButton: false,
                                timer: 1200
                            });

                            setTimeout(() => {
                                navigate("/admin/manageStore");
                            }, 1200);
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!"
                        });
                    });
            }
        });
    }

    return (
        <main className="main" id="main">

            <PageTitle child="Blocked Store" />

            {load &&
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    loading={load}
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
                                        <th>Store Name</th>
                                        <th>Store Code</th>
                                        <th>Store Category</th>
                                        <th>City Name</th>
                                        <th>State Name</th>
                                        <th>Zone Name</th>
                                        <th>Addresss</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {blockedStore.length !== 0 ? (
                                        blockedStore.map((el, index) => (
                                            <tr key={el._id}>
                                                <td>{index + 1}</td>
                                                <td>{el?.storeName}</td>
                                                <td>{el?.storeCode}</td>
                                                <td>{el?.storeCategoryId?.name}</td>
                                                <td>{el?.cityId?.cityName}</td>
                                                <td>{el?.stateId?.stateName}</td>
                                                <td>{el?.zoneId?.zoneName}</td>
                                                <td>{el?.address}</td>
                                                <td>
                                                    <span className="badge bg-danger">
                                                        Blocked
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => changeActiveStatus(el._id)}
                                                    >
                                                        <i className="bi bi-check-circle"></i> Unblock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={10} className="text-center text-muted">
                                                No Blocked Store Category Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            }
        </main>
    );
}
