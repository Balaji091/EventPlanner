import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import "./index.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        let errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!emailPattern.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        }

        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((msg) => toast.error(msg));
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData, { withCredentials: true });

            if (response.data.success) {
                Cookies.set("authenticated",response.data.user_id);
                toast.success("Login successful! Redirecting...");
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const guestLogin = ()=>{
        let guestId = localStorage.getItem("guest_id");
        if (!guestId) {
            guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("guest_id", guestId);
        }
        toast.success("Login successful as Guest! Redirecting...");
                setTimeout(() => navigate("/home"), 2000);
        return guestId;
    }
    return (
        <div className={`login-page ${loading ? "blurred" : ""}`}>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="login-form-container">
                <img src="https://i.postimg.cc/MKb6TcZV/nexbook-bg.jpg" className="login-web-logo" alt="web-logo" />
                <form onSubmit={handleLogin} className="login-form">
                    {[{ label: "Email", name: "email", type: "email" }, { label: "Password", name: "password", type: "password" }].map(({ label, name, type }) => (
                        <div className="login-input-total" key={name}>
                            <p className="login-question">{label}</p>
                            <input type={type} name={name} value={formData[name]} onChange={handleChange} className="login-input" required disabled={loading} />
                        </div>
                    ))}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <ClipLoader color="#fff" size={20} /> : "Login"}
                    </button>
                </form>

                {/* Guest Login Button */}
                or
                <button className="guest-login-btn" onClick={guestLogin}>
                    {loading ? <ClipLoader color="#fff" size={20} /> : "Login as Guest"}
                </button>

                <p className="login-description">Don't have an account? <span className="span-signup" onClick={() => navigate('/signup')}> Sign up</span></p>
            </div>
        </div>
    );
};

export default Login;
