import { Link, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ManageLocation() {
  var [data, setData] = useState([]);
  var [load, setLoad] = useState(true);
  useEffect(() => {
    ApiServices.GetAllCity()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data);
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
        ApiServices.ChangeStatusCity(data)
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

  function changeActiveStatus(id) {
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
          status: true,
        };
        ApiServices.ChangeStatusCity(data)
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
              confirmButtonText: "Continue",
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
    <>
      <main className="main" id="main">
        <PageTitle child="Manage City" />

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
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt-5 table-responsive">
              {!load ? (
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>City</th>
                      <th>Zone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      ?.filter((el) => el.status === true) // ✅ only active
                      ?.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el.cityName}</td>
                          <td>{el.zoneId?.zoneName}</td>
                          <td>
                            <span className="badge bg-success">Active</span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={"/admin/editCity/" + el._id}
                                className="btn"
                                style={{
                                  background: "#197ce6ff",
                                  color: "white",
                                }}
                              >
                                <i className="bi bi-pen"></i>
                              </Link>

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
                      ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
