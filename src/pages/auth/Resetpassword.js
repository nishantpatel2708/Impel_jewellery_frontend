import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DealerServices from "../../services/Dealer/ResetPassword";
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Resetpassword = () => {
  const token = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const handleChange = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };
  const validate = () => {
    let errors = {};
    let isValid = true;

    if (!input["password"]) {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (!input["confirmPassword"]) {
      isValid = false;
      errors["confirmPassword"] = "Please enter your confirm password.";
    }

    if (input["password"] && input["password"].length < 6) {
      isValid = false;
      errors["password"] = "Please add at least 6 characters.";
    } else {
      if (
        input["password"] &&
        input["confirmPassword"] &&
        input["password"] !== input["confirmPassword"]
      ) {
        isValid = false;
        errors["confirmPassword"] =
          "Password and Confirm password doesn't match.";
      }
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setSpinner(true);
      DealerServices.ResetPassword({
        password: input.password,
        confirm_password: input.confirmPassword,
        remember_token: token.token,
      })
        .then((res) => {
          if (res.status === false) {
            toast.error(res.message);
            setInput({
              password: "",
              confirmPassword: "",
            });
          } else {
            toast.success(res.message);
            setInput({
              password: "",
              confirmPassword: "",
            });
            setTimeout(() => {
              navigate("/Dealer_login");
            }, 1200);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setSpinner(false);
        });
    }
  };

  const togglePassword = (e) => {
    e.preventDefault();
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  return (
    <>
      <Helmet>
        <title>Impel Store - Reset Password</title>
      </Helmet>
      <section className="login">
        <div class="container">
          <div className="">
            <div class="row justify-content-center">
              <div className="col-md-5">
                <div className="login_detail">
                  <h2>Reset Password</h2>
                  <form onSubmit={handleSubmit}>
                    <div class="form-group">
                      <input
                        type={passwordType}
                        name="password"
                        placeholder="Password"
                        class="form__input"
                        value={input.password}
                        onChange={handleChange}
                      />
                      <div className="text-danger">{errors.password}</div>
                    </div>
                    <div class="form-group">
                      <input
                        type={passwordType}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        class="form__input"
                        value={input.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        className="btn toggle_btn "
                        onClick={(e) => togglePassword(e)}
                      >
                        {passwordType === "password" ? (
                          <FaEye />
                        ) : (
                          <FaEyeSlash />
                        )}
                      </button>
                      <div className="text-danger">
                        {errors.confirmPassword}
                      </div>
                    </div>
                    <div class="form-group">
                      <button
                        className="btn btn-success dealer_login_btn fw-bolder"
                        style={{ fontSize: "18px" }}
                      >
                        {spinner && (
                          <CgSpinner size={20} className="animate_spin me-2" />
                        )}
                        Reset Password
                      </button>
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

export default Resetpassword;
