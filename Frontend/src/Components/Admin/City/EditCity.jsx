import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function EditCity() {
    var [cityName, setCityName] = useState("")
    var [zoneName, setZoneName] = useState("")
    var [zones, setZones] = useState([])
    var [zoneId, setZoneId] = useState("")
    var [load, setLoad] = useState(false)
    var params = useParams()
    var nav = useNavigate()


    useEffect(() => {
        setLoad(true)
        let data1 = {
            status: "true"
        }
        ApiServices.GetAllZone(data1)
            .then((res) => {
                setZones(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })


        let data = {
            _id: params.id
        }
        ApiServices.GetSingleCity(data)
            .then((res) => {
                setCityName(res?.data?.data?.cityName)
                setZoneName(res?.data?.data?.zoneId?.zoneName)
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
            .catch((err) => {
                console.log("err is", err);
            })
    }, [])

    function handleForm(e) {
        e.preventDefault()
        let data = {
            _id: params.id,
            cityName: cityName,
            zoneId: zoneId
        }
        ApiServices.UpdateCity(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: message,
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/manageCity")
                    }, 1000)
                }
                else {
                    console.log(message);

                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                    }, 1000)
                }
            })
            .catch((err) => {
                setLoad(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonText: 'Continue',
                    timer: 2000,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    setLoad(false)
                }, 2000)
                console.log("Error is ", err);

            })
    }

    return (
        <>
            <main id="main" className="main">
                <PageTitle child="Edit City" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className={load ? "display-screen" : ""}>


                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">City Details</h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">
                                            City Name
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={cityName} onChange={(e) => { setCityName(e.target.value) }} />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Zone Name
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {zoneName || "Select a Zone"}
                                            </button>
                                            {zones?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {zones.length > 0 ? (
                                                                zones.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setZoneName(el.zoneName);
                                                                                setZoneId(el._id);
                                                                            }}
                                                                        >
                                                                            {el.zoneName}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No City found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn" style={{ background: "#6776f4", color: "white" }}>
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
    )
}