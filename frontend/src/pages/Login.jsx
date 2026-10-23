import { useState } from "react"
import Input from "../components/Input";
import Button from "../components/Button";
import validateLogin from "../utils/validation/loginValidation";
import { login } from "../api/authApi";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login(){
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e){
        const {id, value} = e.target;
        setInputs({
            ...inputs,
            [id]: value
        })

        setErrors(prev=> ({
            ...prev,
            [id]: ""
        }))
    }
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState();

    async function handleSubmit(e){
        e.preventDefault();
        setErrors({});
        setSuccess("");

        const validationErrors = validateLogin(inputs);
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }

        try {
            const data = await login(inputs);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            setSuccess("Login successful");
            const role = localStorage.getItem("role");
            if(role === "CUSTOMER"){
                navigate("/events")
            }
            else if(role === "ADMIN"){
                navigate("/admin")
            }
        } catch (error) {
            setErrors({server: error?.response?.data?.message || "Unable to connect to server"})
        }
    }
    return(
        
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
                <div className="container flex-grow-1">
                    <div className="row h-100">

                        {/* left  */}
                        <div className="col-lg-5 d-flex align-items-center justify-content-center">
                            <img 
                                src="/ems.png"
                                alt="Event management"
                                className="img-fluid"
                            />
                            
                        </div>
                        {/* right */}
                        <div className="col-lg-7"> 
                        
                        <div className="row justify-content-center align-items-center  py-5">
                        <div className="col-12 col-lg-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 p-lg-5">
                                    <h2 className="text-center">Login</h2>
                                    <form onSubmit={handleSubmit}>
                                        <Input 
                                            label="Email"
                                            type="text"
                                            placeholder= "Enter your email"
                                            id="email"
                                            value={inputs.email}
                                            onChange={handleChange}
                                            error={errors.email}
                                            isRequired={true}
                                        />
                                        <Input 
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder= "Enter your password"
                                            id="password"
                                            value={inputs.password}
                                            onChange={handleChange}
                                            error={errors.password}
                                            isRequired={true}
                                            eye= {
                                                <Button
                                                    type="button"
                                                    className="btn p-0 text-muted border-0 "
                                                    onClick= {()=> setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff /> : <Eye />}
                                                </Button>
                                            }
                                            
                                        />

                                        {errors.server && (
                                            <div className="alert alert-danger">
                                                {errors.server}
                                            </div>
                                        )}

                                        <div className="d-grid">
                                            <Button className="btn btn-primary">
                                                Login
                                            </Button>
                                        </div>
                                    </form>
                                    <div className="text-center mt-2">
                                        <a>Don't have an account?</a> {' '}
                                        <a href="/register">Register</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

            </div>
            <Footer />
        </div>
            
    )
}