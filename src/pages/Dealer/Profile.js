import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import profileService from "../../services/Auth";
import { ProfileSystem } from "../../context/ProfileContext";

const DealerProfile = () => {
  const { dispatch: image, state: imagestate } = useContext(ProfileSystem);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState("");

  const handleImageChange = (e) => {
    const fileInput = document.getElementById("upload");
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file?.size > maxSize) {
      toast.error("File size exceeds the 5 MB limit");
      fileInput.value = "";
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!allowedTypes?.includes(file?.type)) {
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
            getDealerProfileData();
            image({
              type: "SET_IMAGE",
              payload: { image: !imagestate?.image },
            });
            toast.success(res.message);
          } else {
            getDealerProfileData();
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

  const getDealerProfileData = () => {
    profileService
      .profile({ email: email, token: token })
      .then((res) => {
        setProfileData(res.data);
        localStorage.setItem("user_type", res.data.user_type);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDealerProfileData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - Dealer Profile</title>
      </Helmet>
      <section className="dealer_profile_data">
        <div className="container  mb-5 py-5">
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="card" style={{ height: "100%" }}>
                <div class="card-header">
                  <strong>Owner Information</strong>
                </div>
                <div class="card-body">
                  <table class="table">
                    <tbody>
                      <tr>
                        <th scope="col">Full Name : </th>
                        <td>{profileData?.name}</td>
                      </tr>
                      <tr>
                        <th scope="col">Email : </th>
                        <td>{profileData?.email}</td>
                      </tr>
                      <tr>
                        <th scope="col">Phone No. : </th>
                        <td>{profileData?.phone}</td>
                      </tr>
                      <tr>
                        <th scope="col">Whatsapp No. : </th>
                        <td>{profileData?.phone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="card">
                <div class="card-header">
                  <strong>Company Information</strong>
                </div>
                <div class="card-body">
                  <table class="table">
                    <tbody>
                      <tr>
                        <th scope="col">Company Name : </th>
                        <td>{profileData?.comapany_name}</td>
                      </tr>
                      <tr>
                        <th scope="col">GST No. : </th>
                        <td>{profileData?.gst_no}</td>
                      </tr>
                      <tr>
                        <th scope="col">Address : </th>
                        <td>{profileData?.address}</td>
                      </tr>
                      <tr>
                        <th scope="col">Pincode : </th>
                        <td>{profileData?.pincode}</td>
                      </tr>
                      <tr>
                        <th scope="col">State : </th>
                        <td>{profileData?.state?.name}</td>
                      </tr>
                      <tr>
                        <th scope="col">City : </th>
                        <td>{profileData?.city?.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-md-12 mb-3">
              <div class="card">
                <div class="card-header">
                  <strong>Logo & Documents</strong>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 mb-3 text-center">
                      <h5>Profile Picture</h5>
                      <div>
                        {profileData?.profile && (
                          <>
                            <div className="imagesss">
                              <div className="profile-image">
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
                      </div>
                    </div>
                    <div class="col-md-4 mb-3 text-center">
                      <h5>Company Logo</h5>
                      <div>
                        <img
                          src={profileData?.company_logo}
                          alt="Uploaded"
                          style={{
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            border: "1px solid #ccc",
                            padding: "2px",
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-4 mb-3 text-center">
                      <h5>Documents</h5>
                      <div>
                        {profileData?.documents?.map((file, index) => (
                          <Link
                            to={file?.document}
                            class="btn btn-sm btn-light m-2"
                            style={{ border: "1px solid #ccc" }}
                            target="_blank"
                          >
                            Document {index + 1}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DealerProfile;
