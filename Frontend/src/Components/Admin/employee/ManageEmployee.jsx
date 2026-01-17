import { toast } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function ManageEmployee() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;
  const showPagination = filteredData.length > itemsPerPage;

  // Calculate current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // CSV headers
  const csvHeaders = [
    { label: "Sr No", key: "srNo" },
    { label: "ID", key: "empcode" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contact" },
    { label: "Store Name", key: "storeName" },
    { label: "Designation", key: "jobDesignation" },
  ];

  // CSV data mapping
  const csvData = filteredData
    .filter(emp => emp.status) // Only active employees
    .map((emp, index) => ({
      srNo: index + 1,
      empcode: emp.empcode, // Correct ID
      name: emp.name,
      email: emp.email,
      contact: emp.contact,
      storeName: emp?.storeId?.storeName || "", // Correct Store Name
      jobDesignation: emp.designation,
    }));

  // Fetch employees from backend
  const fetchAllStaff = async () => {
    try {
      setLoad(true);

      const responses = await Promise.all([
        ApiServices.GetAllFm(),
        ApiServices.GetAllClm(),
        ApiServices.GetAllZh(),
        ApiServices.GetAllBf(),
        ApiServices.GetAllProcurement()
      ]);

      const allData = responses.flatMap(res =>
        res?.data?.success ? res.data.data : []
      );

      setData(allData);

    } catch (err) {
      console.log(err);
      setData([]);
    }
    setTimeout(() => {
      setLoad(false);
    }, 500);
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);

  // Filter data based on search
  useEffect(() => {
    const filtered = data
      .filter(el => el.status) // Only active employees
      .filter((el) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          el?.name?.toLowerCase().includes(lowerSearch) ||
          el?.empcode?.toLowerCase().includes(lowerSearch)
        );
      });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // Change employee status (Active → Inactive)
  function changeInactiveStatus(id, designation) {
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
        let payload = {
          _id: id,
          status: "false",
        };

        let apiCall;
        if (designation === "FM") apiCall = ApiServices.ChangeStatusFm;
        else if (designation === "CLM") apiCall = ApiServices.ChangeStatusClm;
        else if (designation === "Zonal_Head") apiCall = ApiServices.ChangeStatusZh;
        else if (designation === "Business_Finance") apiCall = ApiServices.ChangeStatusBf;
        else if (designation === "Procurement") apiCall = ApiServices.ChangeStatusProcurement;
        else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select a valid designation",
          });
          return;
        }

        apiCall(payload)
          .then((res) => {
            Swal.fire({
              title: res?.data?.message,
              icon: res?.data?.success ? "success" : "error",
              showConfirmButton: false,
              timer: 1500,
            });

            // Refetch data after status change
            fetchAllStaff();
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 2000,
            });
            console.log("Error is", err);
          });
      }
    });
  }

  return (
    <main className="main" id="main">
      <PageTitle child="Manage Employee" />

      <div className="container-fluid mb-3" style={{ cursor: "default" }}>
        <div className="row align-items-center">
          {/* Search bar */}
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Download CSV */}
          <div className="col-md-6 text-end">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={`Employee_Report_${new Date().toISOString().slice(0, 10)}.csv`}
              className="btn btn-sm btn-primary"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="container-fluid" style={{ cursor: "default" }}>
        <div className="row justify-content-center">
          <div className="col-lg-12 mt-3 table-responsive">
            <ScaleLoader
              color="#6776f4"
              cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
              size={200}
              loading={load}
            />

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
                  {currentEmployees.length !== 0 ? (
                    currentEmployees.map((el, index) => (
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
                            <Link
                              to={"/admin/editEmployee/" + el._id}
                              state={{ designation: el.designation }}
                              className="btn"
                              style={{ background: "#197ce6ff", color: "white" }}
                            >
                              <i className="bi bi-pen"></i>
                            </Link>

                            <button
                              className="btn ms-2"
                              style={{ background: "#6c757d", color: "white" }}
                              onClick={() =>
                                changeInactiveStatus(el._id, el.designation)
                              }
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center text-muted">
                        No Active Employee Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map(
            (_, idx) => (
              <button
                key={idx}
                className={`btn me-1 ${currentPage === idx + 1 ? "btn-primary" : "btn-light"
                  }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            )
          )}

          <button
            className="btn btn-secondary ms-2"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage))
              )
            }
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
