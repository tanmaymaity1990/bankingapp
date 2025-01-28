import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import Footer from "../partials/Footer";
import axios from "axios";

const Dashboard = () => {
  const [transaction, setTransaction] = useState({});
  const [customers, setCustomers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const getTransaction = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/transaction/limit/10`, {
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

  const getOverdueCustomer = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/transaction/overdue`, {
        headers: {
          apikey: process.env.REACT_APP_API_KEY,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setErrorMessage("");
          setCustomers(response.data.result);
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
    getTransaction();
    getOverdueCustomer();
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
                <h1>Dashboard</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div class="row">
              <div class="col-12">
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
                {customers.map((customer, index) => (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                    key={index}
                  >
                    Customer {customer.name} having account number{" "}
                    {customer.accountNo} has made overdue payment of{" "}
                    {customer.overdueAmount}
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    ></button>
                  </div>
                ))}
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Latest Transactions</h3>
                  </div>
                  <div class="card-body table-responsive p-0">
                    <table class="table table-hover text-nowrap">
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

export default Dashboard;
