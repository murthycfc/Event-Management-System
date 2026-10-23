import { useState } from "react"
import Input from "../components/Input";
import Button from "../components/Button";
import validareRegister from "../utils/validation/registerValidation";
import { register } from "../api/authApi";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register(){
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState()

    function handleChange(e){
        const {id, value} = e.target;
        setInputs({
            ...inputs,
            [id]: value
        })

        setErrors(prev =>({
            ...prev ,
            [id]: ""
        }))
    }

    async function handleSubmit(e){
        e.preventDefault();
        setErrors({});
        setSuccess("");

        const validationErrors = validareRegister(inputs);
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }

        try {
            const data = await register(inputs);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            setSuccess("Registration successful");
            const role = localStorage.getItem("role");
            if(role === "CUSTOMER"){
                navigate("/events")
            }

        } catch (error) {
            setErrors({
                server: error?.response?.data?.message ||
                "Unable to connect to server"
            })
        }
    }

    return(
        <div>

            <Navbar />

            <div className="container">

                <div className="row">

                    {/* left */}
                    <div className="col-lg-5 d-flex align-items-center justify-content-center">
                        <img 
                            src="/ems.png"
                            alt="Event management"
                            className="img-fluid"
                        />
                        
                    </div>

                    {/* right */}
                    <div className="col-lg-7">

                        <div className="row justify-content-center my-2">

                            <div className="col-12 col-lg-8 ">

                                <div className="card border-0 shadow-sm">

                                    <div className="card-body p-1 m-2">

                                        <h2 className="text-center mb-4">
                                            Register
                                        </h2>

                                        <form onSubmit={handleSubmit}>

                                            <Input 
                                                label="Name"
                                                type="text"
                                                placeholder="Enter your name"
                                                id="name"
                                                value={inputs.name}
                                                onChange={handleChange}
                                                error={errors.name}
                                                isRequired={true}
                                            />

                                            <Input 
                                                label="Email"
                                                type="text"
                                                placeholder="Enter your email"
                                                id="email"
                                                value={inputs.email}
                                                onChange={handleChange}
                                                error={errors.email}
                                                isRequired={true}
                                            />

                                            <Input 
                                                label="Password"
                                                type={showPassword ? 'text': 'password'}
                                                placeholder="Enter your password"
                                                id="password"
                                                value={inputs.password}
                                                onChange={handleChange}
                                                error={errors.password}
                                                isRequired={true}
                                                eye={
                                                    <Button
                                                        type="button"
                                                        className="btn p-0 text-muted border-0"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff /> : <Eye />}
                                                    </Button>
                                                }
                                            />

                                            <Input 
                                                label="Confirm Password"
                                                type={showConfirmPassword ? 'text': 'password'}
                                                placeholder="Confirm your password"
                                                id="confirmPassword"
                                                value={inputs.confirmPassword}
                                                onChange={handleChange}
                                                error={errors.confirmPassword}
                                                isRequired={true}
                                                eye={
                                                    <Button
                                                        type="button"
                                                        className="btn p-0 text-muted border-0"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                                    </Button>
                                                }
                                            />

                                            <Input 
                                                label="Phone Number"
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                id="phoneNumber"
                                                value={inputs.phoneNumber}
                                                onChange={handleChange}
                                                error={errors.phoneNumber}
                                                isRequired={true}
                                            />

                                            {errors.server && (
                                                <div className="alert alert-danger">
                                                    {errors.server}
                                                </div>
                                            )}

                                            <div className="d-grid">
                                                <Button className="btn btn-primary">
                                                    Register
                                                </Button>
                                            </div>

                                        </form>

                                        <div className="text-center mt-4">

                                            <span className="text-muted">
                                                Already have an account?{" "}
                                            </span>

                                            <a
                                                href="/login"
                                                className="text-decoration-none fw-semibold"
                                            >
                                                Login
                                            </a>

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
