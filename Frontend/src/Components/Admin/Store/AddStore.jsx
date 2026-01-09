import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useRef, useState } from "react"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function AddStore() {
    var [storeName, setStoreName] = useState("")
    var [storeCode, setStoreCode] = useState("")

    var [storeCategoryName, setStoreCategoryName] = useState("")
    var [storeCategories, setStoreCategories] = useState([])
    var [storeCategoryId, setStoreCategoryId] = useState("")

    var [cityName, setCityName] = useState("")
    var [cities, setCities] = useState([])
    var [CityId, setCityId] = useState("")

    var [zoneName, setZoneName] = useState("")
    var [zones, setZones] = useState([])
    var [zoneId, setZoneId] = useState("")

    var [load, setLoad] = useState(false)
    var nav = useNavigate()
    const fileInputRef = useRef(null);
    useEffect(() => {
        setLoad(true)
        let data = {
            status: "true"
        }
        ApiServices.GetAllStoreCategory(data)
            .then((res) => {
                setStoreCategories(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllCity(data)
            .then((res) => {
                setCities(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllZone(data)
            .then((res) => {
                setZones(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        setTimeout(() => {
            setLoad(false)
        }, 1000)
    }, [])
    function handleForm(e) {
        e.preventDefault()
        setLoad(true)
        let data = {
            storeName: storeName,
            storeCode: storeCode,
            storeCategoryId: storeCategoryId,
            cityId: CityId,
            zoneId: zoneId,
        }
        ApiServices.AddStore(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: message,
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 3000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/addStore")
                        setStoreName("")
                        setStoreCode("")
                        setStoreCategoryName("")
                        setCityName("")
                        setZoneName("")
                    }, 3000)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message,
                        confirmButtonText: 'Continue',
                        timer: 3000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/addStore")
                    }, 3000)
                }

            })
            .catch((err) => {
                setLoad(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonText: 'Continue',
                    timer: 3000,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    setLoad(false)
                }, 3000)
                console.log("Error is", err)
            })


    }
    return (
        <>
            <main id="main" className="main">
                <PageTitle child="Add Store" />
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
                                <h5 className="card-title">Store Details </h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Store Name
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={storeName} onChange={(e) => { setStoreName(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Store Code
                                        </label>
                                        <input type="text" className="form-control" id="inputEmail4" value={storeCode} onChange={(e) => { setStoreCode(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Store Category
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {storeCategoryName || "Select a Store Category"}
                                            </button>
                                            {storeCategories?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {storeCategories.length > 0 ? (
                                                                storeCategories.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setStoreCategoryName(el.name);
                                                                                setStoreCategoryId(el._id);
                                                                            }}

                                                                        >
                                                                            {el.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No Store Category found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            City Name
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {cityName || "Select a City"}
                                            </button>
                                            {cities?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {cities.length > 0 ? (
                                                                cities.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setCityName(el.cityName);
                                                                                setCityId(el._id);
                                                                            }}

                                                                        >
                                                                            {el.cityName}
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
                                                                <li><span className="dropdown-item text-muted">No Zone found</span></li>
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