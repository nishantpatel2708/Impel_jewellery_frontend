import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import profileService from "../../services/Auth";
import { Helmet } from "react-helmet-async";
import { MdEditSquare } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { ProfileSystem } from "../../context/ProfileContext";

const Profile = () => {
  const { dispatch: profilename, state: namestate } = useContext(ProfileSystem);
  const { dispatch: image, state: imagestate } = useContext(ProfileSystem);
  const phone = localStorage.getItem("phone");
  const [showEdit, setShowEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [city, setcity] = useState();
  const [shipping_city, setShipping_city] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);
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

  const handleClose = () => {
    setShow(false);
    setShowEdit(false);
  };

  const handleImageChange = (e) => {
    const fileInput = document.getElementById("upload");
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("File size exceeds the 5 MB limit");
      fileInput.value = "";
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a PNG, JPEG, JPG, or GIF file."
      );
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();

    const myFormData = new FormData(
      document.getElementById("user-profile-form")
    );

    reader.onloadend = () => {
      profileService
        .UserProfileImage(myFormData)
        .then((res) => {
          if (res.status === true) {
            getProfile();
            image({
              type: "SET_IMAGE",
              payload: { image: !imagestate?.image },
            });
            toast.success(res.message);
          } else {
            getProfile();
            toast.error(res.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (file) {
      reader.readAsDataURL(file);
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

  // user profile display function
  const getProfile = async () => {
    await profileService
      .getProfile({ phone: phone })
      .then((res) => {
        const statename = res.data.state.name;
        const cityname = res.data.city.name;
        const shippingstatename = res.data.shipping_state.name;
        const shippingcityname = res.data.shipping_city.name;
        setProfileData({
          ...res.data,
          state_name: statename,
          city_name: cityname,
          shipping_state_name: shippingstatename,
          shipping_city_name: shippingcityname,
          state: res.data.state.id,
          city: res.data.city.id,
          shipping_state: res.data.shipping_state.id,
          shipping_city: res.data.shipping_city.id,
        });
        setUserData({
          ...res.data,
          state_name: statename,
          city_name: cityname,
          shipping_state_name: shippingstatename,
          shipping_city_name: shippingcityname,
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

  const handleEditChange = (e) => {
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

  const handleEdit = async (data) => {
    setShowEdit(true);
    setSelectedData(data);
  };

  const pincodeRegex = /^\d{6}$/;
  const isValidPan = (panNumber) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    return panRegex.test(panNumber);
  };

  const validateForm = () => {
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

    if (userData.pan_no && !isValidPan(userData.pan_no)) {
      validationErrors.pancardErr = "Invalid PAN card format";
      isValid = false;
    } else if (
      userData.pan_no &&
      userData.pan_no !== userData.pan_no.toUpperCase()
    ) {
      validationErrors.pancardErr = "PAN card number should be in uppercase";
      isValid = false;
    } else {
      validationErrors.pancardErr = "";
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
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
    setIsChecked(profileData?.address_same_as_company === 1);
  }, [profileData?.address_same_as_company]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - Profile</title>
      </Helmet>
      <section className="profile user_profile_view">
        <div className="container">
          <div className="row">
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
                <div className="col-xl-4">
                  <div className="card mb-4 mb-xl-0">
                    <div>
                      <div className="card-header">Profile Picture</div>
                      <div className="upload-btn">
                        <div className="button-wrap py-3"></div>
                      </div>
                      <>
                        {profileData?.profile && (
                          <>
                            <div className="imagesss pb-4">
                              <div className="">
                                <form
                                  id="user-profile-form"
                                  method="POST"
                                  encType="multipart/form-data"
                                >
                                  <input
                                    type="hidden"
                                    name="user_id"
                                    value={profileData?.id}
                                  />
                                  <input
                                    id="upload"
                                    name="user_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                  />

                                  <label
                                    htmlFor="upload"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    <img
                                      src={profileData?.profile}
                                      alt="Uploaded"
                                      style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "50%",
                                        border: "1px solid #ccc",
                                        padding: "2px",
                                      }}
                                    />
                                  </label>
                                </form>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    </div>
                  </div>
                </div>
                <div className="col-xl-8">
                  <div className="card mb-4">
                    <div className="card-header">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Account Details</span>
                        <button
                          onClick={() => handleEdit(profileData)}
                          className="btn btn-sm btn-primary"
                        >
                          <MdEditSquare />
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <th scope="col">Full Name : </th>
                            <td>{profileData.name}</td>
                          </tr>
                          <tr>
                            <th scope="col">Email : </th>
                            <td>{profileData.email}</td>
                          </tr>
                          <tr>
                            <th scope="col">Phone : </th>
                            <td>{profileData?.phone?.replace("+91", "")}</td>
                          </tr>
                          <tr>
                            <th scope="col">Billing Address : </th>
                            <td>{profileData.address}</td>
                          </tr>
                          <tr>
                            <th scope="col">City : </th>
                            <td>{profileData.city_name}</td>
                          </tr>
                          <tr>
                            <th scope="col">State : </th>
                            <td>{profileData.state_name}</td>
                          </tr>
                          <tr>
                            <th scope="col">Pincode : </th>
                            <td>{profileData.pincode}</td>
                          </tr>
                          <tr>
                            <th scope="col">Pancard : </th>
                            <td>{profileData.pan_no}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card shippping_address_card">
                    <div class="card-header">
                      <span>
                        <b>Shipping Address</b>
                      </span>
                    </div>
                    <div class="card-body">
                      <table class="table">
                        <tbody>
                          <tr>
                            <th scope="col">Address : </th>
                            <td>{profileData.shipping_address}</td>
                          </tr>
                          <tr>
                            <th scope="col">City : </th>
                            <td>{profileData.shipping_city_name}</td>
                          </tr>
                          <tr>
                            <th scope="col">State : </th>
                            <td>{profileData.shipping_state_name}</td>
                          </tr>
                          <tr>
                            <th scope="col">Pincode : </th>
                            <td>{profileData.shipping_pincode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Modal
          className="form_intent profile_model"
          centered
          show={showEdit}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form
              onSubmit={(e) => handleUpdate(e, selectedData)}
              onKeyUp={(e) => validateForm(e)}
            >
              <div className="row">
                <div className="col-md-6">
                  <Form.Group
                    as={Col}
                    className="mb-2"
                    controlId="formGridState"
                  >
                    <Form.Label>
                      Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="name"
                      defaultValue={selectedData.name}
                      onChange={(e) => handleEditChange(e)}
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
                      onChange={(e) => handleEditChange(e)}
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
                      defaultValue={selectedData?.phone?.replace("+91", "")}
                      disabled
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Group className="mb-2" controlId="formGridAddress1">
                    <Form.Label>Pan-card</Form.Label>
                    <Form.Control
                      name="pan_no"
                      defaultValue={selectedData.pan_no}
                      onChange={(e) => handleEditChange(e)}
                      placeholder="Enter Your Pancard number"
                    />
                    {error.pancardErr && (
                      <span className="text-danger">{error.pancardErr}</span>
                    )}
                  </Form.Group>
                </div>

                <hr />
                <div className="col-md-6">
                  <Form.Group as={Col} className="mb-2" controlId="formGridZip">
                    <Form.Label>
                      Billing Address<span className="text-danger">*</span>
                    </Form.Label>
                    <textarea
                      name="address"
                      className="form-control"
                      defaultValue={selectedData.address}
                      onChange={(e) => {
                        handleEditChange(e);
                      }}
                      placeholder="Enter Your Address"
                    />
                    {error.addressErr && (
                      <span className="text-danger">{error.addressErr}</span>
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
                        handleEditChange(e);
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
                        handleEditChange(e);
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
                      onChange={(e) => handleEditChange(e)}
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
                  <Form.Group as={Col} className="mb-2" controlId="formGridZip">
                    <Form.Label>
                      Shipping Address<span className="text-danger">*</span>
                    </Form.Label>
                    <textarea
                      name="shipping_address"
                      className="form-control"
                      value={userData.shipping_address}
                      onChange={(e) => handleEditChange(e)}
                      placeholder="Enter Your Shipping Address"
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
                        handleEditChange(e);
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
                        handleEditChange(e);
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
                      onChange={(e) => handleEditChange(e)}
                      placeholder="Enter Your Shipping Pincode"
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
                  {spinner && (
                    <CgSpinner size={20} className="animate_spin me-2" />
                  )}
                  Update
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
};

export default Profile;
