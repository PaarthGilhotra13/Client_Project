import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useRef, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddEmployee() {
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [contact, setContact] = useState("");
  var [jobTitle, setJobTitle] = useState("");
  var [jobTitle, setJobTitle] = useState("");
  var [picture, setPicture] = useState("");
  var [load, setLoad] = useState(false);
  var nav = useNavigate();
  const fileInputRef = useRef(null);
  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);
  function handleForm(e) {
    e.preventDefault();
    if (!picture) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a Picture before submitting.",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    setLoad(true);
    let data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("contact", contact);
    data.append("jobTitle", jobTitle);
    data.append("picture", picture);
    ApiServices.AddEmployee(data)
      .then((res) => {
        var message = res?.data?.message;
        setLoad(true);
        if (res?.data?.success) {
          Swal.fire({
            title: message,
            icon: "success",
            draggable: true,
            confirmButtonText: "Continue",
            timer: 3000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            setLoad(false);
            nav("/admin/addEmployee");
            setName("");
            setEmail("");
            setPassword("");
            setContact("");
            setJobTitle("");
            fileInputRef.current.value = "";
          }, 3000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
            confirmButtonText: "Continue",
            timer: 3000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            setLoad(false);
            nav("/admin/addEmployee");
          }, 3000);
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

  return (
    <>
      <main id="main" className="main">
        <PageTitle child="Add Employee" />
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
        <div className={load ? "display-screen" : ""} style={{cursor: "default"}}>
          <div className="col-lg-6 mx-auto mt-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Employee Details</h5>
                {/* Vertical Form */}
                <form className="row g-3" onSubmit={handleForm}>
                  <div className="col-12  form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputNanme4"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="inputNanme4"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="inputNanme4"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Contact</label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className="form-control"
                      id="inputNanme4"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Picture</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-control"
                      id="inputEmail4"
                      onChange={(e) => {
                        setPicture(e.target.files[0]);
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputNanme4"
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn"
                      style={{ background: "#6776f4", color: "white" }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
                {/* Vertical Form */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
