
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "../Login/Login.module.css";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

export const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/users/login", formData);

            // Store the token in localStorage for future API calls
            localStorage.setItem("token", response.data.token);
            console.log(response.data.token);
            toast.success(response.data.message || "Login successful!");

            // Navigate to the desired page
            navigate("/Home");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during login");
            toast.error("An error occurred during login")
        }
    };

    return (
        <div className={styles.MainSectionLogin}>
            <div className={styles.LoginFormData}>
                <div className={styles.LoginImage}>
                    <img src="mainLogo.png" alt="login image" />
                </div>
                <div className={styles.Login}>
                    <h1>Login</h1>
                    <form className={styles.Form} onSubmit={handleSubmit}>
                        <input
                            className={styles.Input}
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className={styles.passwordContainer}>
                            <input
                                className={styles.Input}
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowPassword(!showPassword)} 
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />} 
                            </span>
                        </div>
                        <button className={styles.loginBtn} type="submit">Login</button>
                        {error && <p className={styles.noAccount}>{error}</p>}
                        <div className={styles.newUser}>
                            <p>Don&apos;t have an account?</p>
                            <a className={styles.goToSignUp} href="/SignUp">
                                Signup
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
