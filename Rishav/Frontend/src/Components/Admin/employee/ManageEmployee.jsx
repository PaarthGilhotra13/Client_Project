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
    { label: "Employee ID", key: "_id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contact" },
    { label: "Job Title", key: "jobTitle" },
    { label: "Status", key: "status" },
  ];

  const csvData = filteredData
  .filter(emp => emp.status) // Only active
  .map((emp, index) => ({
    srNo: index + 1,
    _id: emp._id,
    name: emp.name,
    email: emp.email,
    contact: emp.contact,
    jobTitle: emp.jobTitle,
    status: emp.status ? "Active" : "Inactive",
  }));

  // Fetch employees from backend
  const fetchEmployees = () => {
    setLoad(true);
    ApiServices.GetAllEmployee()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data);
        } else {
          setData([]);
        }
        setLoad(false);
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        console.log("Error is ", err);
        setLoad(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter data based on search
useEffect(() => {
  const filtered = data
    .filter((el) => el.status) // Only active employees
    .filter((el) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        el.name.toLowerCase().includes(lowerSearch) ||
        el._id.toLowerCase().includes(lowerSearch)
      );
    });

  setFilteredData(filtered);
}, [searchTerm, data]);
  // Toggle employee status
  const toggleStatus = (id, newStatus) => {
    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiServices.ChangeStatusEmployee({ _id: id, status: newStatus })
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                title: res.data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchEmployees(); // refresh list
            } else {
              Swal.fire({
                title: res.data.message,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {
            toast.error("Something went wrong");
            console.log("Error is", err);
          });
      }
    });
  };

  // Delete employee
  const deleteEmployee = (id) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiServices.DeleteEmployee({ _id: id })
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                title: "Deleted Successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchEmployees();
            } else {
              Swal.fire({
                title: res.data.message,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {
            toast.error("Something went wrong");
            console.log("Error is", err);
          });
      }
    });
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Manage Employee" />

      <div className="container-fluid mb-3" style={{cursor: "default"}}>
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
              filename={`Employee_Report_${new Date()
                .toISOString()
                .slice(0, 10)}.csv`}
              className="btn btn-sm btn-primary"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="container-fluid" style={{cursor: "default"}}>
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
                    <th>Action</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Job Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((el, index) => (
                    <tr key={el._id}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{el._id}</td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn p-0"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            &#x22EE;
                          </button>
                          <ul
                            className="dropdown-menu dropdown-menu-start"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li>
                              <Link
                                className="dropdown-item"
                                to={"/admin/editEmployee/" + el._id}
                              >
                                Edit
                              </Link>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  toggleStatus(el._id, !el.status)
                                }
                              >
                                {el.status ? "Block" : "Unblock"}
                              </button>
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
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.contact}</td>
                      <td>{el.jobTitle}</td>
                      <td>{el.status ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
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
                className={`btn me-1 ${
                  currentPage === idx + 1 ? "btn-primary" : "btn-light"
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
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
