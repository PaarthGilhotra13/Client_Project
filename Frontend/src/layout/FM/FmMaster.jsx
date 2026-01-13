import { Outlet } from "react-router-dom";
import Header from "../Header";
import FmSidebar from "./FmSidebar";

export default function FmMaster() {
    // var nav = useNavigate()
    // useEffect(() => {
    //     var token = sessionStorage.getItem("token")
    //     var userType = sessionStorage.getItem("userType")
    //     //1- Admin, 2- Employee, 3- FM, 4- CLM, 5- Zonal Head, 6- Business Finance,  7- Procurement
    //     const routeMap = {
    //         "3": "/fm",
    //         "4": "/clm",
    //         "5": "/ZonalHead",
    //         "6": "/BusinessFinance",
    //         "7": "/Procurement"
    //     };

    //     if (!token) {
    //         nav("/");
    //     } else {
    //         nav(routeMap[userType] || "/");
    //     }
    // }, [])
    return (
        <>
            <Header />
            <FmSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}