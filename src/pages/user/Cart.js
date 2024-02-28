import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../services/Cart";
import profileService from "../../services/Auth";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { CgSpinner } from "react-icons/cg";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import emptycart from "../../assets/images/empty-cart.png";
import { Helmet } from "react-helmet-async";
import { CartSystem } from "../../context/CartContext";
import { ProfileSystem } from "../../context/ProfileContext";

const Cart = () => {
  const navigate = useNavigate();
  const { dispatch: profilename, state: namestate } = useContext(ProfileSystem);
  const { dispatch: removefromcartDispatch } = useContext(CartSystem);
  const { dispatch: resetcartcount } = useContext(CartSystem);

  const Phone = localStorage.getItem("phone");
  const user_id = localStorage.getItem("user_id");
  const Verification = localStorage.getItem("verification");

  const [isLoading, setIsLoading] = useState(true);
  const [Items, setItems] = useState([]);
  const [dealer_code, setDealer_Code] = useState("");
  const [code, setCode] = useState("");
  const [isFormEmpty, setIsFormEmpty] = useState("");
  const [show, setShow] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [spinner, setSpinner] = useState(false);

  // user profile functionlity
  const [showEdit, setShowEdit] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [city, setcity] = useState();
  const [shipping_city, setShipping_city] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [valid, setValid] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    shipping_address: "",
    shipping_pincode: "",
    shipping_state: "",
    shipping_city: "",
    gst_no: "",
    pan_no: "",
    state: "",
    city: "",
    states: "",
    address_same_as_company: "",
  });
  const [error, setError] = useState({
    nameErr: "",
    emailErr: "",
    addressErr: "",
    pincodeErr: "",
    stateErr: "",
    cityErr: "",
    pancardErr: "",
    gstErr: "",
    shipping_address_err: "",
    shipping_pincode_err: "",
    shipping_state_err: "",
    shipping_city_err: "",
  });

  const fetchCity = async (stateId) => {
    await profileService
      .getCity({ state_id: stateId })
      .then((res) => {
        setcity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchShippingCity = async (cityId) => {
    await profileService
      .getCity({ state_id: cityId })
      .then((res) => {
        setShipping_city(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProfile = async () => {
    await profileService
      .getProfile({ phone: Phone })
      .then((res) => {
        const Billing_shipping_state = res.data.state.name;
        const Billing_shipping_city = res.data.city.name;
        const shipping_state_name = res.data.shipping_state.name;
        const shipping_city_name = res.data.shipping_city.name;
        setProfileData({
          ...res.data,
          state_name: Billing_shipping_state,
          city_name: Billing_shipping_city,
          shipping_state_name: shipping_state_name,
          shipping_city_name: shipping_city_name,
          state: res.data.state.id,
          city: res.data.city.id,
          shipping_state: res.data.shipping_state.id,
          shipping_city: res.data.shipping_city.id,
        });
        setUserData({
          ...res.data,
          state_name: Billing_shipping_state,
          city_name: Billing_shipping_city,
          shipping_state_name: shipping_state_name,
          shipping_city_name: shipping_city_name,
          state: res.data.state.id,
          city: res.data.city.id,
          shipping_state: res.data.shipping_state.id,
          shipping_city: res.data.shipping_city.id,
        });
        res.data.state.id && fetchCity(res.data.state.id);
        res.data.shipping_state.id &&
          fetchShippingCity(res.data.shipping_state.id);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleProfileData = async (data) => {
    setSelectedData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pan_no" && value.length > 10) {
      e.target.value = value.slice(0, 10);
    }

    if (name === "state") {
      setUserData({
        ...userData,
        state: value,
        city: "",
      });
    } else if (name === "shipping_state") {
      setUserData({
        ...userData,
        shipping_state: value,
        shipping_city: "",
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);

    if (event.target.checked) {
      setUserData({
        ...userData,
        shipping_address: userData.address,
        shipping_pincode: userData.pincode,
        shipping_state: userData.state,
        shipping_city: userData.city,
      });
    } else {
      setUserData({
        ...userData,
        shipping_address: "",
        shipping_pincode: "",
        shipping_state: "",
        shipping_city: "",
      });
    }
  };

  const SubTotal = () => {
    let subTotal = 0;
    Items.forEach((data) => {
      const Pricekey = "metal_price_" + data.gold_type;
      const price = parseFloat(data[Pricekey]);
      subTotal += price;
    });
    return subTotal;
  };

  const SubCharge = () => {
    let subCharge = 0;
    Items.forEach((data) => {
      const czStoneCharge = parseFloat(data.cz_stone_charge) || 0;
      const gemstoneCharge = parseFloat(data.gemstone_charge) || 0;
      const makingCharge = parseFloat(data.making_charge) || 0;

      const totalCharge = czStoneCharge + gemstoneCharge + makingCharge;
      subCharge += totalCharge;
    });

    return subCharge;
  };

  const goldColor = {
    yellow_gold: "Yellow Gold",
    rose_gold: "Rose Gold",
    white_gold: "White Gold",
  };

  const pincodeRegex = /^\d{6}$/;

  const isValidPan = (panNumber) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

    return panRegex.test(panNumber);
  };

  const totalPrice = code.discount_value
    ? code.discount_type === "percentage"
      ? SubTotal() + SubCharge() - (SubCharge() * code.discount_value) / 100
      : SubTotal() + SubCharge() - code.discount_value
    : SubTotal() + SubCharge();

  const isPriceAboveLimit = totalPrice >= 200000;

  const FormValidation = () => {
    let isValid = true;
    const validationErrors = { ...error };
    if (!userData.name.trim()) {
      validationErrors.nameErr = "Name is required";
      isValid = false;
    } else {
      validationErrors.nameErr = "";
    }

    if (!userData.email.trim()) {
      validationErrors.emailErr = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z\d\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/i.test(userData.email)
    ) {
      validationErrors.emailErr = "Invalid email address";
      isValid = false;
    } else if (userData.email.indexOf("@") === -1) {
      validationErrors.emailErr = "Email address must contain @ symbol";
      isValid = false;
    } else {
      validationErrors.emailErr = "";
    }

    if (isPriceAboveLimit && !userData.pan_no) {
      setValid(
        "Pancard is required for your total amount is more than 2 lakh or above"
      );
      isValid = false;
    } else if (isPriceAboveLimit && !isValidPan(userData.pan_no)) {
      setValid("Invalid pan-card Format");
      isValid = false;
    } else {
      setValid("");
    }

    if (!userData.address.trim()) {
      validationErrors.addressErr = "Address is required";
      isValid = false;
    } else {
      validationErrors.addressErr = "";
    }
    if (!userData.pincode.trim()) {
      validationErrors.pincodeErr = "Pincode is required";
      isValid = false;
    } else if (!pincodeRegex.test(userData.pincode.trim())) {
      validationErrors.pincodeErr = "Pincode must be a 6-digit number";
      isValid = false;
    } else {
      validationErrors.pincodeErr = "";
    }

    if (userData.state == "" || userData.state == undefined) {
      validationErrors.stateErr = "State must be select";
      isValid = false;
    } else {
      validationErrors.stateErr = "";
    }
    if (userData.city == "" || userData.city == undefined) {
      validationErrors.cityErr = "City must be select";
      isValid = false;
    } else {
      validationErrors.cityErr = "";
    }

    if (!isChecked) {
      if (!isChecked && !userData.shipping_address.trim()) {
        validationErrors.shipping_address_err = "Shipping Address is required";
        isValid = false;
      } else {
        validationErrors.shipping_address_err = "";
      }

      if (!userData.shipping_pincode.trim()) {
        validationErrors.shipping_pincode_err = "Shipping Pincode is required";
        isValid = false;
      } else if (!pincodeRegex.test(userData.shipping_pincode.trim())) {
        validationErrors.shipping_pincode_err =
          "Shipping Pincode must be a 6-digit number";
        isValid = false;
      } else {
        validationErrors.shipping_pincode_err = "";
      }

      if (
        userData.shipping_state == "" ||
        userData.shipping_state == undefined
      ) {
        validationErrors.shipping_state_err = "shipping state must be select";
        isValid = false;
      } else {
        validationErrors.shipping_state_err = "";
      }
      if (userData.shipping_city == "" || userData.shipping_city == undefined) {
        validationErrors.shipping_city_err = "shipping city must be select";
        isValid = false;
      } else {
        validationErrors.shipping_city_err = "";
      }
    } else {
      validationErrors.shipping_address_err = "";
      validationErrors.shipping_pincode_err = "";
      validationErrors.shipping_state_err = "";
      validationErrors.shipping_city_err = "";
    }
    setError(validationErrors);
    return isValid;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const isFormValid = FormValidation();
    if (isFormValid) {
      setSpinner(true);
      const formData = new FormData();
      formData.append("id", selectedData.id);
      formData.append("name", userData.name ? userData.name : "");
      formData.append("email", userData.email ? userData.email : "");
      formData.append("phone", userData.phone ? userData.phone : "");
      formData.append("pan_no", userData.pan_no ? userData.pan_no : "");
      formData.append("gst_no", userData.gst_no ? userData.gst_no : "");

      // company address update
      formData.append("address", userData.address ? userData.address : "");
      formData.append("pincode", userData.pincode ? userData.pincode : "");
      formData.append("state", userData.state ? userData.state : "");
      formData.append("city", userData.city ? userData.city : "");

      // checkbox update
      formData.append("address_same_as_company", isChecked ? "1" : "0");

      // shipping address update
      formData.append(
        "shipping_address",
        isChecked ? userData.address : userData.shipping_address
      );
      formData.append(
        "shipping_pincode",
        isChecked ? userData.pincode : userData.shipping_pincode
      );
      formData.append(
        "shipping_state",
        isChecked ? userData.state : userData.shipping_state
      );
      formData.append(
        "shipping_city",
        isChecked ? userData.city : userData.shipping_city
      );

      profileService
        .updateProfile(formData)
        .then((res) => {
          if (res.status === true) {
            setShowEdit(false);
            getProfile();
            profilename({
              type: "SET_NAME",
              payload: { profilename: !namestate?.profilename },
            });
            toast.success(res.message);
            localStorage.setItem("verification", res.data.verification);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setSpinner(false);
        });
    } else {
    }
  };

  useEffect(() => {
    const validationErrors = {
      shipping_address_err: "",
      shipping_state_err: "",
      shipping_city_err: "",
      shipping_pincode_err: "",
    };

    if (!isChecked) {
      validationErrors.shipping_address_err = "Shipping Address is required";
      validationErrors.shipping_state_err = "shipping state must be select";
      validationErrors.shipping_city_err = "shipping city must be select";
      validationErrors.shipping_pincode_err = "Shipping Pincode is required";
    } else {
      validationErrors.shipping_address_err = "";
      validationErrors.shipping_state_err = "";
      validationErrors.shipping_city_err = "";
      validationErrors.shipping_pincode_err = "";
    }

    setError(validationErrors);
  }, [isChecked]);

  useEffect(() => {
    setIsChecked(profileData?.address_same_as_company === 1);
  }, [profileData?.address_same_as_company]);

  // cart all functiolity
  const UserCartItems = () => {
    UserService.CartList({ phone: Phone })
      .then((res) => {
        setItems(res.data.cart_items);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleDealercode = (e) => {
    setDealer_Code(e.target.value);
  };

  useEffect(() => {
    const savedDiscount = localStorage.getItem("savedDiscount");
    if (savedDiscount) {
      setCode(JSON.parse(savedDiscount));
      setShow(true);
    }
  }, []);

  useEffect(() => {
    UserCartItems();
    getProfile();
  }, []);

  const Applycoupen = (e) => {
    e.preventDefault();
    UserService.DealerCode({ phone: Phone, dealer_code: dealer_code })
      .then((res) => {
        if (res.status === false) {
          setIsFormEmpty(res.message);
          setShow(false);
        } else {
          localStorage.setItem("savedDiscount", JSON.stringify(res.data));
          setShow(true);
          setCode(res.data);
          setIsFormEmpty("");
          toast.success("dealer code applied successfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Remove = (id) => {
    setRemovingItemId(id);
    const payload = id;
    UserService.RemovetoCart({ cart_id: id })
      .then((res) => {
        if (res.status === true) {
          UserCartItems();
          removefromcartDispatch({
            type: "REMOVE_FROM_CART",
            payload,
          });
          toast.success("remove design from cart successfully");
          if (res?.data?.total_quantity == 0) {
            localStorage.removeItem("savedDiscount");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  const Orderplacing = () => {
    const totalPrice = code.discount_value
      ? code.discount_type === "percentage"
        ? SubTotal() + SubCharge() - (SubCharge() * code.discount_value) / 100
        : SubTotal() + SubCharge() - code.discount_value
      : SubTotal() + SubCharge();

    if (Verification == 2) {
      if (totalPrice >= 200000 && !userData?.pan_no) {
        setValid(
          "Pancard is required for your total amount is more than 2 lakh or above"
        );
        setShowEdit(true);
        setSpinner(false);
      } else if (totalPrice < 200000) {
        UserService.Placeorder({
          user_id: user_id,
          dealer_code: code?.dealer_code,
          dealer_discount_type: code?.discount_type,
          dealer_discount_value: code?.discount_value,
          cart_items: Items?.map((item) => item?.id),
          sub_total: SubTotal(),
          charges: SubCharge(),
          total: code?.discount_value
            ? code.discount_type === "percentage"
              ? SubTotal() +
                SubCharge() -
                (SubCharge() * code.discount_value) / 100
              : SubTotal() + SubCharge() - code.discount_value
            : SubTotal() + SubCharge(),
        })
          .then((res) => {
            if (res.status === true) {
              localStorage.removeItem("savedDiscount");
              localStorage.removeItem("cartItems");
              toast.success(res.message);
              setSpinner(true);
              setTimeout(() => {
                navigate(`/order-details/${res.data}`);
              }, 1000);
              resetcartcount({ type: "RESET_CART" });
            }
          })
          .catch((error) => console.log(error));
      } else {
        UserService.Placeorder({
          user_id: user_id,
          dealer_code: code?.dealer_code,
          dealer_discount_type: code?.discount_type,
          dealer_discount_value: code?.discount_value,
          cart_items: Items?.map((item) => item?.id),
          sub_total: SubTotal(),
          charges: SubCharge(),
          total: code?.discount_value
            ? code.discount_type === "percentage"
              ? SubTotal() +
                SubCharge() -
                (SubCharge() * code.discount_value) / 100
              : SubTotal() + SubCharge() - code.discount_value
            : SubTotal() + SubCharge(),
        })
          .then((res) => {
            if (res.status === true) {
              localStorage.removeItem("savedDiscount");
              localStorage.removeItem("cartItems");
              toast.success(res.message);
              setSpinner(true);
              setTimeout(() => {
                navigate(`/order-details/${res.data}`);
              }, 1000);
              resetcartcount({ type: "RESET_CART" });
            }
          })
          .catch((error) => console.log(error));
      }
    } else {
      setShowEdit(true);
      setSpinner(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Impel Store - Cart</title>
      </Helmet>

      <section className="cart">
        <div className="container">
          <div className="row">
            {isLoading ? (
              <>
                <div className="h-100 d-flex justify-content-center">
                  <ReactLoading
                    type={"spin"}
                    color={"#053961"}
                    height={"20%"}
                    width={"10%"}
                    className="loader"
                  />
                </div>
              </>
            ) : (
              <>
                {Items?.length ? (
                  <>
                    <div className="col-md-9">
                      <div className="card border shadow-0">
                        <div className="m-4">
                          <h4 className="card-title mb-4">
                            Your shopping cart
                          </h4>
                          <div className="row gy-3 mb-4">
                            <>
                              <hr />
                              {Items?.map((data, index) => {
                                const Pricekey =
                                  "metal_price_" + data.gold_type;
                                const price = parseFloat(data[Pricekey]);

                                return (
                                  <>
                                    <div className="col-md-3" key={index}>
                                      <div className="d-flex">
                                        <Link
                                          to={`/shopdetails/${data.design_id}`}
                                          className="nav-link"
                                        >
                                          <img
                                            src={data.image}
                                            className="border rounded me-3 w-100"
                                            alt=""
                                          />
                                        </Link>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="">
                                        <Link
                                          to={`/shopdetails/${data.design_id}`}
                                          className="nav-link"
                                        >
                                          {data?.design_name}
                                        </Link>
                                      </div>

                                      <div className="mt-md-2">
                                        <span>
                                          Gold Color : &nbsp;
                                          <b>
                                            {goldColor[data.gold_color]} &nbsp;
                                            {data.gold_type}
                                          </b>
                                        </span>
                                      </div>

                                      <div className="mt-md-2">
                                        <text className="h6">
                                          ₹{price?.toLocaleString("en-US")}
                                        </text>
                                        <br />
                                      </div>
                                    </div>

                                    <div className="col-md-5">
                                      <div className="text-md-end">
                                        <Link
                                          to="#"
                                          className="btn btn-light border text-danger icon-hover-danger text-end"
                                          onClick={() => Remove(data.id)}
                                        >
                                          {removingItemId === data.id && (
                                            <CgSpinner
                                              size={20}
                                              className="animate_spin"
                                            />
                                          )}
                                          {removingItemId === data.id ? (
                                            ""
                                          ) : (
                                            <MdDelete />
                                          )}
                                        </Link>
                                      </div>
                                    </div>
                                    <hr />
                                  </>
                                );
                              })}
                            </>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3">
                      {!show && (
                        <div className="card mb-3 border shadow-0">
                          <div className="card-body">
                            <form>
                              {/* <div className="form-group">
                              <label className="form-label">Have coupon?</label>
                              <div className="input-group">
                                <input  
                                  type="text"
                                  className="form-control border"
                                  name=""
                                  placeholder="Coupon code"
                                />
                                <button className="btn btn-light border">
                                  Apply
                                </button>
                              </div>
                            </div> */}
                              <div className="form-group">
                                <label className="form-label">
                                  Have a Dealer coupon?
                                </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    name="dealer_code"
                                    className="form-control border"
                                    placeholder="Dealer coupon code"
                                    value={dealer_code}
                                    onChange={(e) => handleDealercode(e)}
                                  />
                                  <button
                                    className="btn btn-light border"
                                    onClick={(e) => Applycoupen(e)}
                                  >
                                    Apply
                                  </button>
                                </div>
                                {isFormEmpty ? (
                                  <span className="text-danger">
                                    {isFormEmpty}
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      <div className="card shadow-0 border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Metal price :</p>
                            <p className="mb-2 fw-bold">
                              ₹{SubTotal()?.toLocaleString("en-US")}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Charges :</p>
                            <p className="mb-2 fw-bold">
                              ₹{SubCharge()?.toLocaleString("en-US")}
                            </p>
                          </div>
                          {show && (
                            <div className="d-flex justify-content-between">
                              <p className="mb-2 text-success">
                                Dealer discount ({code.dealer_code})
                                <p>
                                  {code.discount_type === "percentage" ? (
                                    <>(-{code.discount_value}%)</>
                                  ) : (
                                    <></>
                                  )}
                                </p>
                              </p>
                              <p className="mb-2 text-success fw-bold">
                                {code.discount_type === "percentage"
                                  ? `- ₹${(
                                      (SubCharge() * code.discount_value) /
                                      100
                                    )?.toLocaleString("en-US")}`
                                  : `- ₹${code.discount_value}`}
                              </p>
                            </div>
                          )}
                          <hr />
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Total price :</p>
                            <p className="mb-2 fw-bold">
                              {code.discount_value ? (
                                <>
                                  ₹
                                  {(code.discount_type === "percentage"
                                    ? SubTotal() +
                                      SubCharge() -
                                      (SubCharge() * code.discount_value) / 100
                                    : SubTotal() +
                                      SubCharge() -
                                      code.discount_value
                                  )?.toLocaleString("en-US")}
                                </>
                              ) : (
                                <>
                                  ₹
                                  {(SubTotal() + SubCharge()).toLocaleString(
                                    "en-US"
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="mt-3">
                            <button
                              className="btn btn-success w-100 shadow-0 mb-2"
                              disabled={spinner}
                              onClick={(e) => {
                                Orderplacing(e);
                                handleProfileData(profileData);
                              }}
                            >
                              {spinner && (
                                <CgSpinner
                                  size={20}
                                  className="animate_spin me-2"
                                />
                              )}
                              Place Order
                            </button>
                            <Link
                              to="/shop"
                              className="btn btn-light w-100 border mt-2"
                              style={{ display: spinner ? "none" : "block" }}
                            >
                              Back to shop
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="container">
                      <div className="row justify-content-center">
                        <div className="col-lg-8">
                          <div className="card border shadow-sm p-4">
                            <div className="text-center mb-4">
                              <h2 className="card-title mb-0">
                                Your Shopping Cart
                              </h2>
                            </div>

                            <div className="text-center my-4">
                              <img
                                src={emptycart}
                                alt="Empty Cart Illustration"
                                className="img-fluid mb-3"
                                style={{ maxWidth: "200px" }}
                              />
                              <h5 className="text-muted mb-3">
                                Oops! Your cart is empty.
                              </h5>
                              <p className="text-muted">
                                Explore our collection and add items to your
                                cart.
                              </p>
                            </div>

                            <div className="text-center">
                              <Link
                                to="/shop"
                                className="view_all_btn px-4 py-2"
                                style={{ borderRadius: "8px" }}
                              >
                                <FaLongArrowAltLeft className="mr-2" />{" "}
                                &nbsp;Back to Shop
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <Modal
              className="form_intent profile_model"
              centered
              show={showEdit}
            >
              <Modal.Header>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form
                  onSubmit={(e) => handleUpdateProfile(e, selectedData)}
                  onKeyUp={(e) => FormValidation(e)}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group
                        as={Col}
                        className="mb-2"
                        controlId="formGridState"
                      >
                        <Form.Label>
                          Name
                          <span className="text-danger">
                            <b>*</b>
                          </span>
                        </Form.Label>
                        <Form.Control
                          name="name"
                          defaultValue={selectedData.name}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter Your Name"
                        />
                        {error.nameErr && (
                          <span className="text-danger">{error.nameErr}</span>
                        )}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group
                        as={Col}
                        className="mb-2"
                        controlId="formGridState"
                      >
                        <Form.Label>
                          Email<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="email"
                          defaultValue={selectedData.email}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter Your Email"
                        />
                        <span className="text-danger">{error.emailErr}</span>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group
                        as={Col}
                        className="mb-2"
                        controlId="formGridState"
                      >
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          defaultValue={profileData?.phone?.replace("+91", "")}
                          disabled
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6 mb-3">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          Pan-card
                          {valid ? <span className="text-danger">*</span> : ""}
                        </Form.Label>
                        <Form.Control
                          name="pan_no"
                          defaultValue={selectedData.pan_no}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter Your Pancard number"
                        />
                        {valid && <span className="text-danger">{valid}</span>}
                      </Form.Group>
                    </div>

                    <hr />
                    <div className="col-md-6">
                      <Form.Group
                        as={Col}
                        className="mb-2"
                        controlId="formGridZip"
                      >
                        <Form.Label>
                          Billing Address<span className="text-danger">*</span>
                        </Form.Label>
                        <textarea
                          name="address"
                          className="form-control"
                          defaultValue={selectedData.address}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          placeholder="Enter Your Address"
                        />
                        {error.addressErr && (
                          <span className="text-danger">
                            {error.addressErr}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          State<span className="text-danger">*</span>
                        </Form.Label>
                        <select
                          className="form-control"
                          name="state"
                          onChange={(e) => {
                            handleChange(e);
                            fetchCity(e.target.value);
                          }}
                          value={userData.state}
                        >
                          <option value="">--state select--</option>
                          {profileData?.states?.map((userstate, index) => (
                            <option key={index} value={userstate.id}>
                              {userstate.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">{error.stateErr}</span>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          City<span className="text-danger">*</span>
                        </Form.Label>
                        <select
                          className="form-control"
                          name="city"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={userData.city}
                        >
                          <option value="">--city select--</option>
                          {city?.map((usercity, index) => (
                            <option key={index} value={usercity.id}>
                              {usercity.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">{error.cityErr}</span>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          Pincode<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="pincode"
                          defaultValue={selectedData.pincode}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter Your Pincode"
                          maxLength={6}
                        />
                        <span className="text-danger">{error.pincodeErr}</span>
                      </Form.Group>
                    </div>
                    <div className="address-checkbox-btn">
                      <input
                        type="checkbox"
                        id="checkbox"
                        name="address_same_as_company"
                        className="address-checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        htmlFor="checkbox"
                        className="ms-1 address-check-text"
                        style={{ cursor: "pointer" }}
                      >
                        Shipping Address is as same above then check this box
                      </label>
                    </div>
                    <hr className="mt-3" />
                    <div className="col-md-6">
                      <Form.Group
                        as={Col}
                        className="mb-2"
                        controlId="formGridZip"
                      >
                        <Form.Label>
                          Shipping Address<span className="text-danger">*</span>
                        </Form.Label>
                        <textarea
                          name="shipping_address"
                          className="form-control"
                          value={userData.shipping_address}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          placeholder="Enter Your Address"
                        />
                        <span className="text-danger">
                          {error.shipping_address_err}
                        </span>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          Shipping-State<span className="text-danger">*</span>
                        </Form.Label>
                        <select
                          className="form-control"
                          name="shipping_state"
                          onChange={(e) => {
                            handleChange(e);
                            fetchShippingCity(e.target.value);
                          }}
                          value={userData.shipping_state}
                        >
                          <option value="">--shipping state select--</option>
                          {profileData?.states?.map((userstate, index) => (
                            <option key={index} value={userstate.id}>
                              {userstate.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {error.shipping_state_err}
                        </span>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          Shipping-City<span className="text-danger">*</span>
                        </Form.Label>
                        <select
                          className="form-control"
                          name="shipping_city"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={userData.shipping_city}
                        >
                          <option value="">--shipping City select--</option>
                          {shipping_city?.map((usercity, index) => (
                            <option key={index} value={usercity.id}>
                              {usercity.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-danger">
                          {error.shipping_city_err}
                        </span>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Group className="mb-2" controlId="formGridAddress1">
                        <Form.Label>
                          Shipping Pincode<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="shipping_pincode"
                          value={userData.shipping_pincode}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter Your Pincode"
                          maxLength={6}
                        />
                        <span className="text-danger">
                          {error.shipping_pincode_err}
                        </span>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
