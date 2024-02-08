import { useContext, useState } from "react";
import Style from "./Login.module.css";
import axios from "axios";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate()
  const { API, isLoading, setIsLoading } = useContext(UserContext)
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    generic: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: "" }));
  };

  // form validation
  const validateForm = () => {
    let isValid = true;
    const newError = { ...error };

    if (userData.email.trim() === "") {
      newError.email = "Email is required";
      isValid = false;
    }

    if (userData.password.trim() === "") {
      newError.password = "Password is required";
      isValid = false;
    } else if (userData.password.length < 6) {
      newError.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  // fetch login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/api/user/login`, userData);
      if (response) {
        const authToken = await response.data.token;
        localStorage.setItem('authToken', authToken);
        setTimeout(() => {
          navigate('/dashboard')
        }, 4000);
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.error : "An error occurred";
      setError((prevError) => ({ ...prevError, generic: errorMsg }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={Style.login}>
      <form onSubmit={handleLogin}>
        <div className={Style.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter email..."
          />
          {error.email && <p className={Style.errorTag}>{error.email}</p>}
        </div>

        <div className={Style.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter password..."
          />
          {error.password && <p className={Style.errorTag}>{error.password}</p>}
          {error.generic && <p className={Style.errorTag}>{error.generic}</p>}
        </div>

        <div className={Style.checkboxGroup} />

        <button
          type="submit"
          className={Style.submitButton}
        >
          {isLoading ? "Loading" : "Login"}
        </button>
      </form>
    </div>
  );
}
