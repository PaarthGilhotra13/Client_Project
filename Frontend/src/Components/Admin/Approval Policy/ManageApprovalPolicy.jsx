import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function ManageApprovalPolicy() {

    const [policies, setPolicies] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
         ApiServices.GetAllApprovalPolicy()
              .then((res) => {
                if (res?.data?.success) {
                  setPolicies(res?.data?.data);
                } else {
                  setData([]);
                }
                setTimeout(() => {
                  setLoad(false);
                }, 500);
              })
              .catch((err) => {
                console.log("Error is ", err);
                setTimeout(() => {
                  setLoad(false);
                }, 1000);
              });
    }, [load]);
    function changeInactiveStatus(id) {
        Swal.fire({
            title: "Confirm Status Change",
            text: "Are you sure you want to change the status?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    _id: id,
                    status: "false",
                };
                console.log(id);

                ApiServices.ChangeStatusApprovalPolicy(data)
                    .then((res) => {
                        setLoad(true);
                        var message = res?.data?.message;
                        if (res.data.success) {
                            Swal.fire({
                                title: message,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            setTimeout(() => {
                                setLoad(false);
                            }, 1500);
                        } else {
                            Swal.fire({
                                title: message,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            setTimeout(() => {
                                setLoad(false);
                            }, 1500);
                        }
                    })
                    .catch((err) => {
                        setLoad(true);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                            timer: 2000,
                            timerProgressBar: true,
                        });
                        setTimeout(() => {
                            setLoad(false);
                        }, 2000);
                        console.log("Error is", err);
                    });
            }
        });
    }
    return (
        <main className="main" id="main">
            <PageTitle child="Manage Approval Policy" />

            {/* Loader */}
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-md-12">
                        <ScaleLoader
                            color="#6776f4"
                            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                            size={200}
                            loading={load}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-12 mt-5 table-responsive">
                        {!load ? (
                            <table className="table table-hover table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Min Amount</th>
                                        <th>Max Amount</th>
                                        <th>Approval Levels</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {policies
                                        ?.filter((el) => el.status === true)
                                        ?.map((el, index) => {
                                            return (
                                                <tr key={el._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.minAmount}</td>
                                                    <td>{el.maxAmount}</td>
                                                    <td>
                                                        {el.approvalLevels?.join(" → ")}
                                                    </td>
                                                    <td>
                                                        {el.status === true ? "Active" : "Inactive"}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group">
                                                            {/* EDIT */}
                                                            <Link
                                                                to={"/admin/editApprovalPolicy/" + el._id}
                                                                className="btn"
                                                                style={{
                                                                    background: "#197ce6ff",
                                                                    color: "white",
                                                                }}
                                                            >
                                                                <i className="bi bi-pen"></i>
                                                            </Link>

                                                            {/* INACTIVE */}
                                                            <button
                                                                className="btn ms-2"
                                                                style={{
                                                                    background: "#6c757d",
                                                                    color: "white",
                                                                }}
                                                                onClick={() => changeInactiveStatus(el._id)}
                                                            >
                                                                <i className="bi bi-x-circle"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </main>

    );
}
