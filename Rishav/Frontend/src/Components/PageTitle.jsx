import { Link } from "react-router-dom";

export default function PageTitle({child}) {
    return (
        <>
            <div className="pagetitle">
                <h1>{child}</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/admin">Home</Link>
                        </li>
                        <li className="breadcrumb-item active">{child}</li>
                    </ol>
                </nav>
            </div>

        </>
    )
}