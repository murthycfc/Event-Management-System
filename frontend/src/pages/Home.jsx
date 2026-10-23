import { useNavigate } from "react-router";
import Button from "../components/Button";

export default function Home(){

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    function handleExplore(){
        if(role==="ADMIN"){
            navigate("/admin")
        }
        else{
            navigate("/events");
        }
    }
    return(
        <div>
            <section className="container py-5 text-center">
                <h1 className="fw-bold">
                    Welcome to Event Management System
                </h1>

                <p className="text-muted mt-3">
                    Discover, book, and enjoy amazing events with low price.
                </p>

                <div className="mt-4">

                    <Button
                        onClick={handleExplore}
                        className="btn btn-primary me-2"
                    >
                        {role==="ADMIN"? "Go to dashboard" : "Explore Events"}
                    </Button>

                    <a href="/register" className="btn btn-outline-primary">
                        Get Started
                    </a>
                </div>
            </section>
        </div>
    )
}