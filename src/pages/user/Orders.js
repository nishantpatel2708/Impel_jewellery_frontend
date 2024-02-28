import React, { useEffect, useState } from "react";
import Userservice from "../../services/Cart";
import { Link, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import BreadCrumb from "../../components/common/BreadCrumb";
import { Helmet } from "react-helmet-async";

const Orders = () => {
  const id = useParams();
  const user_id = localStorage.getItem("user_id");
  const user_type = localStorage.getItem("user_type");
  const [Items, setItems] = useState([]);
  const [status, setStatus] = useState();
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const GetUserOrders = async () => {
    Userservice.Orderdetails({
      order_id: id.id,
      user_id: user_id,
      user_type: user_type,
    })
      .then((res) => {
        setItems(res.data);
        setProduct(res.data?.order_items);
        setStatus(res?.status);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    GetUserOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - Order Details</title>
      </Helmet>
      <section className="my_orders">
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
            {status === false ? (
              <div className="container">
                <div className="row justify-content-center text-center">
                  <div className="col-md-12">
                    <div class="order-error-section pt-5">
                      <div class="page">
                        Ooops!!! The Order you are looking for is not found
                      </div>
                      <Link to="/" class="back-home">
                        Back to home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container">
                {/* Order Details */}
                <div className="order_details">
                  <div className="row">
                    <div className="col-md-12">
                      <BreadCrumb
                        firstName="Home"
                        firstUrl="/"
                        secondName="My Orders"
                        secondUrl="/my_orders"
                        thirdName="Order Details"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <div
                        className="card"
                        style={{
                          border: "none",
                          boxShadow: "2px 2px 2px  #ccc",
                          height: "100%",
                        }}
                      >
                        <div className="card-body">
                          <h4 className="header-title">Order Information</h4>
                          <table className="table">
                            <tbody>
                              <tr>
                                <th scope="col">Order No :</th>
                                <td>#{Items?.order_id}</td>
                              </tr>
                              <tr>
                                <th scope="col">Order Status :</th>
                                {Items?.order_status == "pending" && (
                                  <td>
                                    <span className="badge bg-warning">
                                      Pending
                                    </span>
                                  </td>
                                )}
                                {Items?.order_status == "accepted" && (
                                  <td>
                                    <span className="badge bg-info">
                                      Accepted
                                    </span>
                                  </td>
                                )}
                                {Items?.order_status == "processing" && (
                                  <td>
                                    <span className="badge bg-primary">
                                      Processing
                                    </span>
                                  </td>
                                )}
                                {Items?.order_status == "completed" && (
                                  <td>
                                    <span className="badge bg-success">
                                      Completed
                                    </span>
                                  </td>
                                )}
                              </tr>
                              <tr>
                                <th scope="col">Order Date :</th>
                                <td>{Items?.order_date}</td>
                              </tr>
                              <tr>
                                <th scope="col">Order Time :</th>
                                <td>{Items?.order_time}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div
                        className="card"
                        style={{
                          border: "none",
                          boxShadow: "2px 2px 2px  #ccc",
                          height: "100%",
                        }}
                      >
                        <div className="card-body">
                          <h4 className="header-title">Customer Information</h4>
                          <table className="table">
                            <tbody>
                              <tr>
                                <th scope="col">Name :</th>
                                <td>{Items?.customer}</td>
                              </tr>
                              <tr>
                                <th scope="col">Email :</th>
                                <td>{Items?.customer_email}</td>
                              </tr>
                              <tr>
                                <th scope="col">Phone :</th>
                                <td>
                                  {Items?.customer_phone?.replace("+91", "")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div
                        className="card"
                        style={{
                          border: "none",
                          boxShadow: "2px 2px 2px  #ccc",
                          height: "100%",
                        }}
                      >
                        <div className="card-body shipping-Information">
                          <h4 className="header-title">Shipping Information</h4>
                          <table className="table">
                            <tbody>
                              <tr>
                                <th scope="col">Address :</th>
                                <td>{Items?.address}</td>
                              </tr>
                              <tr>
                                <th scope="col">City :</th>
                                <td>{Items?.city}</td>
                              </tr>
                              <tr>
                                <th scope="col">State :</th>
                                <td>{Items?.state}</td>
                              </tr>
                              <tr>
                                <th scope="col">Pin-Code :</th>
                                <td>{Items?.pincode}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Products */}
                <div className="order_products">
                  <div className="row mb-3">
                    <div className="col-lg-12 col-md-12">
                      <div
                        className="card"
                        style={{
                          border: "none",
                          boxShadow: "2px 2px 2px  #ccc",
                        }}
                      >
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table mb-0">
                              <thead className="table-light text-center">
                                <tr>
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Code</th>
                                  <th>Quantity</th>
                                  <th>Gold Type</th>
                                  <th>Gold Color</th>

                                  <th>Net Weight</th>
                                  <th>Metal Price</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody className="text-center">
                                {product?.map((datas) => (
                                  <>
                                    <tr>
                                      <td>
                                        <Link
                                          to={`/shopdetails/${datas?.design_id}`}
                                          className="nav-link"
                                          target="_blank"
                                        >
                                          <img
                                            src={datas?.design_image}
                                            alt=""
                                            style={{ width: "100px" }}
                                          />
                                        </Link>
                                      </td>
                                      <td>
                                        <Link
                                          to={`/shopdetails/${datas?.design_id}`}
                                          className="nav-link"
                                          target="_blank"
                                        >
                                          <span>{datas?.design_name}</span>
                                        </Link>
                                      </td>
                                      <td>
                                        <span>
                                          <strong>{datas?.design_code}</strong>
                                        </span>
                                      </td>
                                      <td>
                                        <span>{datas?.quantity}</span>
                                      </td>
                                      <td>
                                        <span>{datas?.gold_type}</span>
                                      </td>
                                      <td>
                                        <span>{datas?.gold_color}</span>
                                      </td>
                                      <td>
                                        <span> {datas?.net_weight} g.</span>
                                      </td>
                                      <td>
                                        <span>
                                          ₹
                                          {datas?.item_sub_total?.toLocaleString(
                                            "en-US"
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        <span>
                                          <strong>
                                            ₹
                                            {datas?.item_total?.toLocaleString(
                                              "en-US"
                                            )}
                                          </strong>
                                        </span>
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Payments */}
                <div className="order_payments">
                  <div className="row justify-content-end">
                    <div className="col-lg-4 col-md-4">
                      <div
                        className="card"
                        style={{
                          border: "none",
                          boxShadow: "2px 2px 2px  #ccc",
                        }}
                      >
                        <div className="card-body">
                          <h4 className="header-title">Order Summary</h4>
                          <div className="table-responsive">
                            <table className="table mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Description</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <strong>Metal Price :</strong>
                                  </td>
                                  <td>
                                    ₹{Items?.sub_total?.toLocaleString("en-US")}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Charges :</strong>
                                  </td>
                                  <td>
                                    ₹{Items?.charges?.toLocaleString("en-US")}
                                  </td>
                                </tr>
                                {Items?.dealer_code &&
                                  Items?.dealer_discount_type &&
                                  Items?.dealer_discount_value && (
                                    <tr>
                                      <td>
                                        <strong className="text-success">
                                          Dealer Discount <br />(
                                          {Items?.dealer_code}) &nbsp;
                                          <span>
                                            {Items?.dealer_discount_type ===
                                            "percentage" ? (
                                              <>
                                                (-{Items?.dealer_discount_value}
                                                %)
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                        </strong>
                                        &nbsp;:
                                      </td>
                                      <td className="text-success">
                                        <p className="m-0">
                                          {Items?.dealer_discount_type ===
                                          "percentage"
                                            ? `- ₹${(
                                                (Items?.charges *
                                                  Items?.dealer_discount_value) /
                                                100
                                              )?.toLocaleString("en-US")}`
                                            : `- ₹${Items?.dealer_discount_value}`}
                                        </p>
                                      </td>
                                    </tr>
                                  )}

                                <tr>
                                  <th>Total Amount (Approx) :</th>
                                  <th>
                                    ₹{Items?.total?.toLocaleString("en-US")}
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Orders;
