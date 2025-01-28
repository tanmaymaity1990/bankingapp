import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";

const AddTransaction = () => {
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    toAccount: "",
    amount: 0,
  });
  const [customer, setCustomer] = useState([]);
  const [account, setAccount] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const getCustomer = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/customers`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setErrorMessage("");
          setCustomer(response.data.result);
        } else {
          setSuccessMessage("");
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };

  const getAccountNo = async (e) => {
    if (e.target.value !== "") {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/customer/${e.target.value}`, {
          headers: {
            apikey: process.env.REACT_APP_API_KEY,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setErrorMessage("");
            setAccount(response.data.result.accountNo);
          } else {
            setSuccessMessage("");
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
        });
    } else {
      setAccount("");
    }
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.customerId);

    const validationErrors = {};
    if (!formData.customerId) {
      validationErrors.customerId = "This field is required";
    }
    if (!account) {
      validationErrors.fromAccount = "This field is required";
    }
    if (!formData.toAccount) {
      validationErrors.toAccount = "This field is required";
    }
    if (!formData.amount) {
      validationErrors.amount = "This field is required";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/transaction`,
          {
            customerId: formData.customerId,
            fromAccount: parseInt(account),
            toAccount: parseInt(formData.toAccount),
            amount: parseFloat(formData.amount),
          },
          {
            headers: {
              apikey: process.env.REACT_APP_API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status) {
            setFormData({
              customerId: "",
              toAccount: "",
              amount: 0,
            });
            setAccount("");
            setErrorMessage("");
            setSuccessMessage(response.data.message);
            setMessage(response.data.message);
            navigate("/transaction");
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
    getCustomer();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Add Transaction</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
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
            <div className="card card-info">
              <div className="card-header">
                <h3 className="card-title">Fill in the below details</h3>
              </div>
              <div className="row">
                <div className="col-12">
                  <form className="form-horizontal" onSubmit={handleSubmit}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Customer
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <select
                                className={
                                  errors.customerId
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="customerId"
                                onChange={(e) => {
                                  handleChange(e);
                                  getAccountNo(e);
                                }}
                              >
                                <option value="">Select</option>
                                {customer.map((item, index) => (
                                  <option value={item.id}>
                                    {item.name} ({item.accountNo})
                                  </option>
                                ))}
                              </select>
                              {errors.customerId && (
                                <div className="invalid-feedback text-left">
                                  {errors.customerId}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              From Account
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                className={
                                  errors.fromAccount
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="fromAccount"
                                onChange={handleChange}
                                value={account}
                                autoComplete="off"
                                readOnly
                              />
                              {errors.fromAccount && (
                                <div className="invalid-feedback text-left">
                                  {errors.fromAccount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              To Account
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="number"
                                className={
                                  errors.toAccount
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="toAccount"
                                onChange={handleChange}
                                value={formData.toAccount}
                                autoComplete="off"
                              />
                              {errors.toAccount && (
                                <div className="invalid-feedback text-left">
                                  {errors.toAccount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group row">
                            <label className="col-sm-3 col-form-label">
                              Amount
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <input
                                type="number"
                                className={
                                  errors.amount
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="amount"
                                onChange={handleChange}
                                value={formData.amount}
                                autoComplete="off"
                              />
                              {errors.amount && (
                                <div className="invalid-feedback text-left">
                                  {errors.amount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button type="submit" className="btn btn-info">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AddTransaction;
