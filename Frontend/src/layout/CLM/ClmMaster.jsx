import { Outlet } from "react-router-dom";
import Header from "../Header";
import ClmSidebar from "./ClmSidebar";

export default function ClmMaster() {
    return (
        <>
            <Header />
            <ClmSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}