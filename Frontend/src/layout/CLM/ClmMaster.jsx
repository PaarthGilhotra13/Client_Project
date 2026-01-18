import { Outlet } from "react-router-dom";
import ClmSidebar from "./ClmSidebar";
import ClmHeader from "./ClmHeader";

export default function ClmMaster() {
    return (
        <>
            <ClmHeader />
            <ClmSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}