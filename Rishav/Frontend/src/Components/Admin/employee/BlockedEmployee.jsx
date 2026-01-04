import { toast } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function BlockedEmployee() {
  var [data, setData] = useState([]);
  var [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [filteredData, setFilteredData] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // Calculate current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const showPagination = filteredData.length > itemsPerPage;
  // This will be mapped in <tbody> instead of filteredData
  const currentEmployees = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Total pages for pagination buttons
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    const filtered = data.filter((el) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        el.name.toLowerCase().includes(lowerSearch) ||
        el._id.toLowerCase().includes(lowerSearch)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);

  useEffect(() => {
    ApiServices.GetAllEmployee()
      .then((res) => {
        if (res?.data?.success) {
          // Only keep employees with status === false
          const blockedEmployees = res.data.data.filter(
            (emp) => emp.status === false
          );
          setData(blockedEmployees);
        } else {
          setData([]);
        }
        setTimeout(() => {
          setLoad(false);
        }, 500);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        console.log("Error is ", err);
        setTimeout(() => {
          setLoad(false);
        }, 1000);
      });
  }, [load]);
function deleteEmployee(id) {
    Swal.fire({
      title: "Confirm Delete Employee",
      text: "Are you sure to Delete Employee permanently?",
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
        ApiServices.DeleteEmployee(data)
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
        ApiServices.ChangeStatusEmployee(data)
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
        ApiServices.ChangeStatusEmployee(data)
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
  let ext;
  function getFileType(fileName) {
    if (!fileName) {
      return "other";
    }
    ext = fileName.split(".").pop().toLowerCase();
    if (
      ext == "jpg" ||
      ext == "jpeg" ||
      ext == "png" ||
      ext == "gif" ||
      ext == "bmp" ||
      ext == "webp" ||
      ext == "svg" ||
      ext == "ico"
    ) {
      return "image";
    }
    if (
      ext === "pdf" ||
      ext === "zip" ||
      ext === "doc" ||
      ext === "docx" ||
      ext === "xls" ||
      ext === "xlsx" ||
      ext === "ppt" ||
      ext === "pptx" ||
      ext === "txt" ||
      ext === "rtf"
    ) {
      return "document";
    }
  }
  return (
    <>
      <main className="main" id="main">
        <PageTitle child="Manage Employee" />
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
        {/* Search bar */}
        <div className="container-fluid mb-3">
          <div className="row justify-content-end">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt- table-responsive">
              {!load ? (
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Id</th>
                      <th>Action</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Job Title</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees?.map((el, index) => {
                      const fileType = getFileType(el?.picture);
                      const ext = el?.picture?.split(".").pop(); // get file extension
                      return (
                        <tr key={el._id}>
                          <td>
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>{" "}
                          {/* continuous numbering */}
                          <td>{el?._id}</td>
                          <td>
                            <div class="dropdown">
                              <button
                                class="btn p-0"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                &#x22EE;
                              </button>
                              <ul
                                class="dropdown-menu dropdown-menu-start"
                                aria-labelledby="dropdownMenuButton"
                              >
                                <li>
                                  <Link
                                    class="dropdown-item"
                                    to={"/admin/editEmployee/" + el?._id}
                                  >
                                    Edit
                                  </Link>
                                </li>
                                <li>
                                  {el.status ? (
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        changeInactiveStatus(el._id)
                                      }
                                    >
                                      Block
                                    </button>
                                  ) : (
                                    <button
                                      className="dropdown-item"
                                      onClick={() => changeActiveStatus(el._id)}
                                    >
                                      Unblock
                                    </button>
                                  )}
                                </li>
                               <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => deleteEmployee(el._id)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                          <td>{el?.name}</td>
                          <td>{el?.email}</td>
                          <td>{el?.contact}</td>
                          {/* <td>
                            {fileType === "document" ? (
                              <Link to={el?.picture} rel="noopener noreferrer">
                                <i className="bi bi-file-earmark-fill fs-1" />
                                <span>(.{ext})</span>
                              </Link>
                            ) : (
                              <img
                                src={el?.picture}
                                alt="No Document found"
                                style={{ width: 100, height: 120 }}
                              />
                            )}
                          </td> */}
                          {/* <td>{el?.experience}</td> */}
                          <td>{el?.jobTitle}</td>
                          {/* <td>{el?.joiningDate}</td> */}
                          {/* <td>{el?.coins}</td> */}
                          <td>{el?.status ? "true" : "false"}</td>
                          {/* <td>
                            <div className="btn-group">
                              <Link
                                to={"/admin/editEmployee/" + el?._id}
                                className="btn"
                                style={{
                                  background: "#197ce6ff",
                                  color: "white",
                                }}
                              >
                                <i className="bi bi-pen"></i>
                              </Link>
                              {el.status ? (
                                <button
                                  className="btn ms-2"
                                  style={{
                                    background: "#6c757d",
                                    color: "white",
                                  }}
                                  onClick={() => changeInactiveStatus(el._id)}
                                >
                                  <i className="bi bi-x-circle "></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success ms-2"
                                  onClick={() => changeActiveStatus(el._id)}
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                              )}
                            </div>
                          </td> */}
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
        </div>{" "}
        {showPagination && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`btn me-1 ${
                  currentPage === idx + 1 ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="btn btn-secondary ms-2"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}
