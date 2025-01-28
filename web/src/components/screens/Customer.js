import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";

const Customer = () => {
  const navigate = useNavigate();
  const { message, setMessage } = useMessage();
  const [customer, setCustomer] = useState({});
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleChange = (e) => {
    setSuccessMessage("");
    const { value } = e.target;
    setSearch(value);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setSearch("");
    getCustomer();
    navigate("/customer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .get(`${process.env.REACT_APP_API_URL}/customer/search/${search}`, {
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

  useEffect(() => {
    getCustomer();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  return (
    <>
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Customers</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
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
              </div>
              <div className="col-12">
                <Link to="/customer/add" className="btn btn-success mb-2">
                  Add Customer
                </Link>
                <form className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="input-sm form-control col-8 mr-4"
                      placeholder="Search"
                      name="search"
                      value={search}
                      onChange={handleChange}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Go!
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                    </span>
                  </div>
                </form>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">List of customers</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Account Number</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Created</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.length > 0 ? (
                          customer.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.accountNo}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.phone}</td>
                              <td>{item.created}</td>
                              <td>
                                <Link to={`/customer/view/${item.id}`}>
                                  <i className="fa fa-eye mr-3"></i>
                                </Link>
                                <Link to={`/customer/edit/${item.id}`}>
                                  <i className="fa fa-edit"></i>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-danger text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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

export default Customer;
