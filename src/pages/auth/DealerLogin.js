import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const DealerLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [passwordType, setPasswordType] = useState("password");

  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const togglePassword = (e) => {
    e.preventDefault();
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    if (!loginData.email) {
      setError("Please enter your email.");
      return;
    }

    if (!loginData.password) {
      setError("Please enter your password.");
      return;
    }
    setIsSubmitting(true);
    setSpinner(true);
    let formdata = new FormData();
    formdata.append("email", loginData.email);
    formdata.append("password", loginData.password);

    const userData = {
      email: loginData.email,
      password: loginData.password,
    };

    axios
      .post(
        "https://harmistechnology.com/admin.indianjewelley/api/user-login",
        userData
      )
      .then((response) => {
        if (response.data.success === true) {
          setUser(response.data);
          localStorage.setItem("isLogin", true);
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user_id", response.data.data.user.id);
          localStorage.setItem("user_type", response.data.data.user.user_type);
          localStorage.setItem("email", loginData.email);
          localStorage.removeItem("showPopup");
          navigate("/");
        } else {
          navigate("/Dealer_login");
          toast.error(response.data.message);
          setLoginData.email("");
          setLoginData.password("");
          setUser("");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Impel Store - Dealer Login</title>
      </Helmet>
      <section className="login">
        <div class="container">
          <div className="">
            <div class="row justify-content-center">
              <div className="col-md-5">
                <div className="login_detail">
                  <h2>Dealer Login</h2>
                  <form onSubmit={handleSubmit}>
                    <div class="form-group">
                      <input
                        type="text"
                        name="email"
                        onChange={(e) => handleChange(e)}
                        placeholder="Registered Email ID"
                        class="form__input"
                      />
                      {error && error === "Please enter your email." && (
                        <span className="text-danger">{error}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        type={passwordType}
                        name="password"
                        onChange={(e) => handleChange(e)}
                        placeholder="Password"
                        class="form__input"
                      />
                      <span
                        className="toggle_btn"
                        onClick={(e) => togglePassword(e)}
                      >
                        {passwordType === "password" ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </span>
                      {error && error === "Please enter your password." && (
                        <span className="text-danger">{error}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <button
                        className="btn btn-success dealer_login_btn fw-bolder"
                        style={{ fontSize: "18px" }}
                      >
                        {spinner && (
                          <CgSpinner size={20} className="animate_spin me-2" />
                        )}
                        {spinner ? "" : "Login"}
                      </button>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="text-start">
                          <Link
                            to="/forget-password"
                            className="text-decoration-none text-danger"
                          >
                            Forgot Password?
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="/login"
                            className="text-decoration-none text-success"
                          >
                            Customer Login?
                          </Link>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default DealerLogin;
