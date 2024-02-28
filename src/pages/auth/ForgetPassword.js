import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DealerServices from "../../services/Dealer/ResetPassword";
import { CgSpinner } from "react-icons/cg";
import { Helmet } from "react-helmet-async";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [errmessage, setErrMessage] = useState("");
  const [spinner, setSpinner] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(value)) {
      setError("");
    } else {
      setError("Please enter a valid email");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setSpinner(true);
    DealerServices.ForgetPassword({
      email: email,
      reset_url: window.location.origin + "/reset-password",
    })
      .then((res) => {
        if (res.status === false) {
          setErrMessage(res.message);
          setEmail("");
        } else {
          setMessage(res.message);
          setEmail("");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setSpinner(false);
      });
  };

  useEffect(() => {
    let timeoutId;

    if (message || errmessage) {
      timeoutId = setTimeout(() => {
        setMessage("");
        setErrMessage("");
      }, 4000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, errmessage]);

  return (
    <>
      <Helmet>
        <title>Impel Store - Forget Password</title>
      </Helmet>
      <section className="login">
        <div class="container">
          <div className="">
            <div class="row justify-content-center">
              <div className="col-md-5">
                <div className="login_detail">
                  <h2>Forget Password</h2>
                  <div className={`message-container ${message ? "my-3" : ""}`}>
                    {message && <span className="message-text">{message}</span>}
                  </div>
                  <div
                    className={`message-container ${errmessage ? "my-3" : ""}`}
                  >
                    {errmessage && (
                      <span className="message-text text-danger">
                        {errmessage}
                      </span>
                    )}
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div class="form-group">
                      <input
                        type="text"
                        name="email"
                        onChange={(e) => handleChange(e)}
                        placeholder="Registered Email ID"
                        class="form__input"
                        value={email}
                      />
                      {error && <span className="text-danger">{error}</span>}
                    </div>
                    <button
                      className="btn btn-success dealer_login_btn mt-3 fw-bolder"
                      style={{ fontSize: "18px" }}
                    >
                      {spinner && (
                        <CgSpinner size={20} className="animate_spin me-2" />
                      )}
                      Send reset password link
                    </button>
                    <p>
                      <Link
                        to="/Dealer_login"
                        className="text-decoration-none text-success"
                      >
                        Back to dealer login
                      </Link>
                    </p>
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

export default ForgetPassword;
