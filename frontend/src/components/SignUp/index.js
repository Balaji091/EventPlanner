import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false); // Added loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach((msg) => toast.error(msg));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before proceeding
        if (!validateForm()) return;
    
        setLoading(true); // Start loading
    
        try {
            const response = await axios.post(
                "http://localhost:5001/auth/signup", 
                {
                    email: formData.email,
                    password: formData.password,
                },
                { 
                    withCredentials: true // This is where you should specify the credentials option
                }
            );
    
            if (response.data.success) {
                Cookies.set("authenticated", true); // Set a cookie upon successful registration
                toast.success("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
            }
        } catch (error) {
            // Handle errors more gracefully
            const errorMessage = error.response?.data?.message || "Something went wrong. Try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };
    

    return (
        <div className="container-wrapper">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="sign-up-form-container">
                <img 
                    src="https://i.postimg.cc/MKb6TcZV/nexbook-bg.jpg" 
                    className="login-signup-web-logo" 
                    alt="web-logo" 
                />
                <h2 className="sign-up-heading">Create Your Account</h2>
                <form onSubmit={handleSubmit} className="sign-up-form">
                    {[
                        { label: "Email", name: "email", type: "email" },
                        { label: "Password", name: "password", type: "password" },
                        { label: "Confirm Password", name: "confirmPassword", type: "password" }
                    ].map(({ label, name, type }) => (
                        <div className="signup-login-input-total" key={name}>
                            <p className="login-signup-question">{label}</p>
                            <input 
                                type={type} 
                                name={name} 
                                value={formData[name]} 
                                onChange={handleChange} 
                                className="sign-up-input" 
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="sign-up-btn" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Sign up"}
                    </button>
                </form>
                <p className="sign-up-description">
                    Already have an account? <span onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
