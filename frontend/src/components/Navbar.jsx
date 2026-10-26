import { Link, useNavigate } from "react-router"
import Button from "./Button";
import { logout } from "../api/authApi";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function Navbar(){
    const navigate = useNavigate();

    const [token, setToken] = useState(
        ()=> localStorage.getItem("token")
    );
    const [logoutModal, setLogoutModal] = useState(false)

    function handleLogout(){
        setLogoutModal(true);
    }
    async function confirmLogout() {
        const data = await logout();
        localStorage.clear();
        setToken(null);
        navigate("/");
        setLogoutModal(false);
    }
    return(
        <div 
            className="navbar "
            style={{backgroundImage: "linear-gradient(90deg, #6e6af1 0%, #554EE2 100%)"}}
        >
            <div className="container d-flex align-items-center justify-content-between ">
                <div className="d-flex align-items-center gap-1">
                    <Link
                        className="navbar-brand"
                        to="/"
                    >
                        <img 
                            src="/logo1.jpg"
                            alt = "my logo"
                            height="50"
                        />
                    </Link>

                    <span 
                        className="text-white fw-medium text-nowrap">
                        EventPlus 
                    </span>
                </div>
                

                <div className="d-flex align-items-center gap-2 ms-auto-md">
                    {token && (
                        <Link
                            to="/myBookings"
                            className="btn btn-light"
                        > My Bookings
                        </Link>
                    )}

                    {token && (
                        <Button
                            className="btn btn-light"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}

                    {!token && (
                        <Link
                            to="/login"
                            className="btn btn-light"
                        >
                            Login
                        </Link>
                    )}
                </div>
                

            </div>
            <Modal
                show={logoutModal}
                onHide={()=>setLogoutModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Confirm Logout
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure want to logout?</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={()=>setLogoutModal(false)}
                    >
                        Close
                    </Button>

                    <Button
                        className="btn btn-danger"
                        onClick={confirmLogout}
                    >
                        Logout
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    )
}