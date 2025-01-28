import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";

const ViewCustomer = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const { message, setMessage } = useMessage();
  const [customer, setCustomer] = useState({});
  const [transaction, setTransaction] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const getCustomer = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/customer/${id}`, {
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

  const getTransaction = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/customer/transaction/${id}`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setErrorMessage("");
          setTransaction(response.data.result);
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
    getTransaction();
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
                <h1>View Customer</h1>
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
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Customer Details</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <tbody>
                        <tr>
                          <td>Account Number</td>
                          <td>{customer.accountNo}</td>
                        </tr>
                        <tr>
                          <td>Account Type</td>
                          <td>{customer.accountType}</td>
                        </tr>
                        <tr>
                          <td>Name</td>
                          <td>{customer.name}</td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td>{customer.email}</td>
                        </tr>
                        <tr>
                          <td>Phone</td>
                          <td>{customer.phone}</td>
                        </tr>
                        <tr>
                          <td>Spend Limit</td>
                          <td>{customer.amountLimit}</td>
                        </tr>
                        <tr>
                          <td>Opening Balanace</td>
                          <td>{customer.openingBal}</td>
                        </tr>
                        <tr>
                          <td>Created</td>
                          <td>{customer.created}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">List of transactions</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>From Account</th>
                          <th>To Account</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction.length > 0 ? (
                          transaction.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.fromAccount}</td>
                              <td>{item.toAccount}</td>
                              <td>${item.amount}</td>
                              <td>{item.created}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-danger text-center">
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

export default ViewCustomer;
