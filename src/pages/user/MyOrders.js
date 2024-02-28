import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { FaEye } from "react-icons/fa";
import Userservice from "../../services/Cart";
import { Helmet } from "react-helmet-async";

const MyOrders = () => {
  const user_id = localStorage.getItem("user_id");
  const user_type = localStorage.getItem("user_type");
  const [Items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const GetAllOrders = async () => {
    Userservice.UserOrders({ user_type: user_type, user_id: user_id })
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    GetAllOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - My orders</title>
      </Helmet>
      <section className="cart">
        {isLoading ? (
          <div className="h-100 d-flex justify-content-center">
            <ReactLoading
              type={"spin"}
              color={"#053961"}
              height={"10%"}
              width={"10%"}
              className="loader"
            />
          </div>
        ) : (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div
                    className="card"
                    style={{ border: "none", boxShadow: "2px 2px 2px  #ccc" }}
                  >
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <thead className="table-light text-center">
                            <tr>
                              <th>Order No.</th>
                              <th>Customer</th>
                              <th>Phone No.</th>
                              <th>Dealer</th>
                              <th>Dealer Code</th>
                              {user_type == 1 ? <th>Dealer Commission</th> : ""}
                              {user_type == 1 ? <th>Commission Status</th> : ""}
                              <th>Order Satus</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {Items?.length ? (
                              <>
                                {Items?.map((datas, index) => {
                                  const phoneNumber =
                                    datas?.customer_phone?.replace("+91", "");
                                  return (
                                    <>
                                      <tr key={index}>
                                        <td>
                                          <span>{datas?.order_id}</span>
                                        </td>
                                        <td>
                                          <span>{datas?.customer}</span>
                                        </td>
                                        <td>
                                          <span>{phoneNumber}</span>
                                        </td>
                                        <td>
                                          {datas?.dealer ? (
                                            <span>{datas?.dealer}</span>
                                          ) : (
                                            <span>-</span>
                                          )}
                                        </td>
                                        <td>
                                          {datas?.dealer_code ? (
                                            <span>{datas?.dealer_code}</span>
                                          ) : (
                                            <span>-</span>
                                          )}
                                        </td>
                                        {user_type == 1 ? (
                                          <td>
                                            <span>
                                              ₹
                                              {Math.round(
                                                datas?.dealer_commission
                                              )}
                                            </span>
                                          </td>
                                        ) : (
                                          ""
                                        )}

                                        {user_type == 1 ? (
                                          <td>
                                            {datas?.commission_status == 1 && (
                                              <span className="badge bg-success">
                                                Paid
                                              </span>
                                            )}
                                            {datas?.commission_status == 0 && (
                                              <span className="badge bg-danger">
                                                Unpaid
                                              </span>
                                            )}
                                          </td>
                                        ) : (
                                          ""
                                        )}

                                        <td>
                                          {datas?.order_status == "pending" && (
                                            <span className="badge bg-warning">
                                              Pending
                                            </span>
                                          )}
                                          {datas?.order_status ==
                                            "accepted" && (
                                            <span className="badge bg-info">
                                              Accepted
                                            </span>
                                          )}
                                          {datas?.order_status ==
                                            "processing" && (
                                            <span className="badge bg-primary">
                                              Processing
                                            </span>
                                          )}
                                          {datas?.order_status ==
                                            "completed" && (
                                            <span className="badge bg-success">
                                              Completed
                                            </span>
                                          )}
                                        </td>
                                        <td>
                                          <span>
                                            <Link
                                              to={`/order-details/${datas?.order_id}`}
                                              className="btn btn-primary btn-sm"
                                            >
                                              <FaEye />
                                            </Link>
                                          </span>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })}
                              </>
                            ) : (
                              <>
                                <tr className="text-center">
                                  <td colSpan="7" className="p-3">
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "26px" }}
                                    >
                                      Records Not Found!
                                    </span>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default MyOrders;
