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

  // Fetch employees from backend
  const fetchAllStaff = async () => {
    try {
      setLoad(true);

      const responses = await Promise.all([
        ApiServices.GetAllFm({ status: "false" }),
        ApiServices.GetAllClm({ status: "false" }),
        ApiServices.GetAllZh({ status: "false" }),
        ApiServices.GetAllBf({ status: "false" }),
        ApiServices.GetAllProcurement({ status: "false" })
      ]);

      const allData = responses.flatMap(res =>
        res?.data?.success ? res.data.data : []
      );

      setData(allData);

    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      setLoad(false)
    }, 1000)
  };


  useEffect(() => {
    fetchAllStaff();
  }, []);

  function changeActiveStatus(id, designation) {
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
          status: true
        }
        let apiCall;
        if (designation === "FM") {
          apiCall = ApiServices.ChangeStatusFm;
        }
        else if (designation === "CLM") {
          apiCall = ApiServices.ChangeStatusClm;
        }
        else if (designation === "Zonal_Head") {
          apiCall = ApiServices.ChangeStatusZh;
        }
        else if (designation === "Business_Finance") {
          apiCall = ApiServices.ChangeStatusBf;
        }
        else if (designation === "Procurement") {
          apiCall = ApiServices.ChangeStatusProcurement;
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select a valid designation",
          });
          setLoad(false);
          return;
        }
        apiCall(data)
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
        <PageTitle child="Blocked Employee" />
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
        {!load && (
          <div className="container-fluid mb-3" style={{ cursor: "default" }}>
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
        )}
        {/* table starts */}
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt- table-responsive">
              {!load && (
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Store Name</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.map((el, index) => (
                      <tr key={el._id}>
                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                        <td>{el.empcode}</td>
                        <td>{el?.name}</td>
                        <td>{el?.email}</td>
                        <td>{el?.contact}</td>
                        <td>{el?.storeId?.storeName}</td>
                        <td>{el?.designation}</td>
                        <td>{el.status ? "Active" : "Inactive"}</td>
                        <td>
                          <div className="btn-group">

                            <Link className="btn btn-success ms-2" onClick={() => { changeActiveStatus(el?._id, el?.designation) }}>
                              <i className="bi bi-check-circle"></i>
                              {/* Active */}
                            </Link>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
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
                className={`btn me-1 ${currentPage === idx + 1 ? "btn-primary" : "btn-light"
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
