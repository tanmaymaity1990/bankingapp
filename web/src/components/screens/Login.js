import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

const Login = () => {
  const navigate = useNavigate();
  const { message, setMessage } = useMessage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setSuccessMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value) {
      setErrors((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      setErrors({ ...errors, [name]: "This field is required" });
    }
    if (name === "email" && value !== "") {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        setErrors({ ...errors, [name]: "Invalid email address" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.email.trim()) {
      validationErrors.email = "This field is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email.trim())
    ) {
      validationErrors.email = "Invalid email address";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "This field is required";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              apikey: process.env.REACT_APP_API_KEY,
            },
          }
        )
        .then((response) => {
          if (response.data.status) {
            const token = response.data.token;
            localStorage.setItem("token", token);
            setFormData({
              email: "",
              password: "",
            });
            setErrorMessage("");
            setSuccessMessage(response.data.message);
            navigate("/dashboard");
          } else {
            setSuccessMessage("");
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
        });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message, setMessage]);
  return (
    <>
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="card card-outline card-primary">
            <div className="card-header text-center">
              <h3 className="h1">
                <b>Bankingapp</b>
              </h3>
            </div>
            <div className="card-body">
              {errorMessage !== "" && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {errorMessage}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}
              {successMessage !== "" && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {successMessage}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}
              {message !== "" && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {message}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}
              <p className="login-box-msg">Sign in to start your session</p>
              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className={
                      errors.email ? "form-control is-invalid" : "form-control"
                    }
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    autoComplete="off"
                    placeholder="Email"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope"></span>
                    </div>
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback text-left">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className={
                      errors.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    autoComplete="off"
                    placeholder="Password"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback text-left">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
