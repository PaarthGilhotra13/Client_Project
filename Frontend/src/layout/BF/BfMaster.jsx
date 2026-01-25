import { Outlet } from "react-router-dom";
import BfHeader from "./BfHeader";
import BfSidebar from "./BfSidebar";

export default function BfMaster() {
    return (
        <>
            <BfHeader />
            <BfSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}