import { ScaleLoader } from "react-spinners";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageTitle from "../../PageTitle";

export default function AdminProfile() {
  var [load, setLoad] = useState(false);
  const [profile, setProfile] = useState([]);
  var [name, setName] = useState("");
  var [contact, setContact] = useState("");
  var [experience, setExperience] = useState("");
  var [jobTitle, setJobTitle] = useState("");
  var [picture, setPicture] = useState("");
  var [linkedin, setLinkedin] = useState("");
  var [github, setGithub] = useState("");

  var [currentPassword, setCurrentPassword] = useState("");
  var [newPassword, setNewPassword] = useState("");
  var [confirmPassword, setConfirmPassword] = useState("");
  var [imagePreview, setImagePreview] = useState("");
  const id = sessionStorage.getItem("userId");
  const empId = sessionStorage.getItem("empId");
  var nav = useNavigate();
  useEffect(() => {
    setLoad(true);
    let data = {
      _id: id,
    };
    ApiServices.GetAllUser(data)
      .then((res) => {
        setProfile(res?.data?.data[0]);
      })
      .catch((err) => {
        console.log("Error is ", err);
      });
    setLoad(false);
  }, [load]);

  function editProfile(e) {
    e.preventDefault();
    let data = new FormData();
    data.append("_id", empId);
    data.append("name", name);
    data.append("contact", contact);
    data.append("experience", experience);
    data.append("jobTitle", jobTitle);
    data.append("picture", picture);
    data.append("linkedin", linkedin);
    data.append("github", github);
    ApiServices.UpdateEmployee(data)
      .then((res) => {
        setLoad(true);
        var message = res?.data?.message;
        if (res?.data?.success) {
          Swal.fire({
            title: message,
            icon: "success",
            draggable: true,
            confirmButtonText: "Continue",
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            setLoad(false);
          }, 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
            confirmButtonText: "Continue",
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            setLoad(false);
          }, 2000);
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
  function changePassword(e) {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    let data = {
      _id: id,
      newpassword: newPassword,
      confirmpassword: confirmPassword,
    };

    setLoad(true);

    ApiServices.ChangePassword(data)
      .then((res) => {
        var message = res?.data?.message;

        if (res?.data?.success) {
          Swal.fire({
            title: message,
            icon: "success",
            confirmButtonText: "Continue",
            timer: 2000,
            timerProgressBar: true,
          });

          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          Swal.fire("Error", "Something went wrong!", "error");
        }

        setLoad(false);
      })
      .catch((err) => {
        Swal.fire("Error", "Something went wrong!", "error");
        setLoad(false);
        console.log("Error is", err);
      });
  }

  function imageupload(e) {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setPicture(e.target.files[0]);
  }
  function logoutfun() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logout !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logout Successfully!",
          text: "You have been redirected to the login page.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        sessionStorage.clear();
        nav("/");
      }
    });
  }
  return (
    <>
      <main id="main">
        <PageTitle child="My Profile" />

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

        <section className="section profile">
          <div className={load ? "display-screen" : ""}>
            <div className="row">
              <div className="col-xl-4">
                <div className="card">
                  <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid #fff",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <img
                        src={profile.picture || "/assets/img/admin_Profile.png"}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block",
                        }}
                      />
                    </div>

                    <h2 className="mt-3">{name}</h2>
                    <h3 className="text-muted" style={{ fontSize: "1rem" }}>
                      {jobTitle}
                    </h3>

                    <div className="social-links mt-3 d-flex justify-content-center gap-3">
                      <Link
                        to={profile.github}
                        className="github text-decoration-none fs-4"
                        style={{ color: "black" }}
                      >
                        <i className="bi bi-github" />
                      </Link>
                      <Link
                        to={profile.linkedin}
                        className="linkedin text-decoration-none text-primary fs-4"
                      >
                        <i className="bi bi-linkedin" />
                      </Link>
                      <Link
                        className="text-decoration-none fs-4"
                        onClick={logoutfun}
                        style={{ color: "grey" }}
                      >
                        <i class="bi bi-box-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="card">
                  <div className="card-body pt-3">
                    {/* Bordered Tabs */}
                    <ul
                      className="nav nav-tabs nav-tabs-bordered"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-overview"
                          aria-selected="true"
                          role="tab"
                        >
                          Overview
                        </button>
                      </li>

                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-change-password"
                          aria-selected="false"
                          role="tab"
                          tabIndex={-1}
                        >
                          Change Password
                        </button>
                      </li>
                    </ul>
                    <div
                      className="tab-content pt-2"
                      style={{ cursor: "default" }}
                    >
                      <div
                        className="tab-pane fade profile-overview active show"
                        id="profile-overview"
                        role="tabpanel"
                      >
                        <h5 className="card-title">Profile Details</h5>
                        <div className="row">
                          <div className="col-lg-3 col-md-4 label ">
                            Full Name
                          </div>
                          <div className="col-lg-9 col-md-8">
                            {profile.name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">Email</div>
                          <div className="col-lg-9 col-md-8">
                            {profile.email}
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade profile-edit pt-3"
                        id="profile-edit"
                        role="tabpanel"
                      ></div>

                      <div
                        className="tab-pane fade pt-3"
                        id="profile-change-password"
                        role="tabpanel"
                      >
                        {/* Change Password Form */}
                        <form onSubmit={changePassword}>
                          <div className="row mb-3">
                            <label
                              htmlFor="newPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              New Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="newpassword"
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="renewPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Re-enter New Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="renewpassword"
                                type="password"
                                className="form-control"
                                id="renewPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-center">
                            <button
                              type="submit"
                              style={{ background: "#6776f4", color: "white" }}
                              className="btn btn-primary"
                            >
                              Change Password
                            </button>
                          </div>
                        </form>
                        {/* End Change Password Form */}
                      </div>
                    </div>
                    {/* End Bordered Tabs */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
