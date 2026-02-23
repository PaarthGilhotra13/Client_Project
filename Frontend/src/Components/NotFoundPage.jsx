import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    var nav=useNavigate()
    var token=sessionStorage.getItem("token")
    var userType=sessionStorage.getItem("userType")
    function homeFunction(e){
        e.preventDefault()
        if(!token){
            nav("/login")
        }
        else{
            if(userType==1){
                nav("/admin")
            }
            if(userType==3){
                nav("/fm")
            }
            if(userType==4){
                nav("/clm")
            }
            if(userType==5){
                nav("/ZonalHead")
            }
            if(userType==6){
                nav("/BusinessFinance")
            }
            if(userType==7){
                nav("/Procurement")
            }
            if(userType==8){
                nav("/PR_PO")
            }
            if(userType==9){
                nav("/ZonalCommercial")
            }
            if(userType==10){
                nav("/MissingBridge")
            }
        }
    }
    return (
        <>
                <div className="container-fluid">
                    <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                        <h1>404</h1>
                        <h2>The page you are looking for doesn't exist.</h2>
                        <Link className="btn" onClick={homeFunction}>
                            Back to home
                        </Link>
                        <img
                            src="/assets/img/not-found.svg"
                            className="img-fluid "
                            alt="Page Not Found"
                        />
                    </section>
                </div>
            

        </>
    )
}