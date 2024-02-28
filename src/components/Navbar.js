import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaBars, FaStar, FaUser, FaUserAlt } from "react-icons/fa";
import { BsHandbag, BsHeart } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";

import { Tooltip as ReactTooltip } from "react-tooltip";

import Logo from "../assets/images/logo.png";
import NOimage from "../assets/images/user-demo-image.png";

import UserService from "../services/Cart";
import Userservice from "../services/Auth";
import FilterServices from "../services/Filter";
import profileService from "../services/Auth";

import { WishlistSystem } from "../context/WishListContext";
import { CartSystem } from "../context/CartContext";
import { ProfileSystem } from "../context/ProfileContext";

const Navbar = () => {
  const { cartItems } = useContext(CartSystem);
  const { state: cartstate } = useContext(CartSystem);

  const { wishlistItems } = useContext(WishlistSystem);
  const { state: wishliststate } = useContext(WishlistSystem);

  const { state: imagestate } = useContext(ProfileSystem);
  const { state: namestate } = useContext(ProfileSystem);

  const location = useLocation();
  const currentRoute = location.pathname;

  const Dealer = localStorage.getItem("token");
  const DealerEmail = localStorage.getItem("email");
  const Phone = localStorage.getItem("phone");

  const [colorChange, setColorchange] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [image, setImage] = useState([]);
  const [userCartCounts, setUsererCartCounts] = useState();
  const [wishlistCount, setWishlistCount] = useState();

  const [dealerData, setDealerData] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState([]);

  const [isMenuActive, setMenuActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dropdownRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);

  const navigate = useNavigate();

  let tagIds = searchParams.getAll("tag_id");

  tagIds =
    Array.isArray(tagIds) && tagIds.length > 0 ? tagIds[0].split(",") : [];

  tagIds = tagIds.map((i) => parseFloat(i));

  const handleTag = (tagId) => {
    if (tag.includes(tagId)) {
      setTag(tag.filter((id) => id !== tagId));
    } else {
      setTag([...tag, tagId]);
    }
  };

  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
    } else {
      setColorchange(false);
    }
  };
  window.addEventListener("scroll", changeNavbarColor);

  const UserCartItems = () => {
    UserService.CartList({ phone: Phone })
      .then((res) => {
        setUsererCartCounts(res.data.total_quantity);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const UserWishlist = () => {
    Userservice.userWishlist({ phone: Phone })
      .then((res) => {
        setWishlistCount(res?.data?.total_quantity);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Tags = () => {
    FilterServices.headerTags()
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserProfile = () => {
    profileService
      .getProfile({ phone: Phone })
      .then((res) => {
        setProfileData(res.data.name);
        setImage(res.data.profile);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProfileData = () => {
    profileService
      .profile({ email: DealerEmail, token: Dealer })
      .then((res) => {
        setDealerData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    UserCartItems();
  }, [cartItems]);

  useEffect(() => {
    UserWishlist();
  }, [wishlistItems]);

  useEffect(() => {
    if (Phone) {
      getUserProfile();
    }
  }, [Phone, namestate?.profilename, imagestate?.image]);

  useEffect(() => {
    if (DealerEmail) {
      getProfileData();
    }
  }, [DealerEmail, imagestate?.image]);

  useEffect(() => {
    Tags();
  }, []);

  const handleLogout = () => {
    if (Dealer) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      localStorage.removeItem("total_quantity");
      setIsLoggedOut(true);
      navigate("/Dealer_login");
    } else {
      localStorage.removeItem("_grecaptcha");
      localStorage.removeItem("phone");
      localStorage.removeItem("verification");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      localStorage.removeItem("total_quantity");
      localStorage.removeItem("savedDiscount");
      localStorage.removeItem("isChecked");
      setIsLoggedOut(true);
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleOutsideClick);
    };
  }, []);

  const handleNavClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navbarRef = useRef(null);

  const handleScroll = () => {
    const navbar = navbarRef.current;
    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={colorChange ? "header sticky_header" : "header"}>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <div className="header_inner">
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleNavClick}
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <FaBars className="text-white" />
            </button>
            <div
              className={`collapse navbar-collapse ${
                isCollapsed ? "" : "show"
              }`}
              id="navbarSupportedContent"
              ref={navbarRef}
            >
              <ul className="navbar-nav mb-2 mb-lg-0 w-100">
                <li className="nav-item">
                  <Link
                    className={
                      currentRoute === "/" ? "nav-link active" : "nav-link"
                    }
                    aria-current="page"
                    to="/"
                    onClick={handleNavClick}
                  >
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <div>
                    <Link
                      className={
                        currentRoute === "#" ? "nav-link active" : "nav-link"
                      }
                      aria-current="page"
                      to="#"
                      onClick={handleNavClick}
                    >
                      Ready To Dispatch
                    </Link>
                  </div>
                </li>

                <li className="nav-item main-tags">
                  <Link to="#" className="nav-link" aria-current="page">
                    Tags
                    <IoMdArrowDropdown />
                  </Link>
                  <div className="tags-dropdown">
                    <div className="row">
                      {tags?.length ? (
                        <>
                          <div className="col-md-2">
                            <div className="tags-links">
                              <Link
                                className={
                                  currentRoute === "/shop"
                                    ? "nav-link active tag-shop-link"
                                    : "nav-link"
                                }
                                style={{ fontSize: "17px", fontWeight: "800" }}
                                to="/shop"
                                onClick={handleNavClick}
                              >
                                All Jwellery
                              </Link>
                            </div>
                          </div>

                          {tags?.map((multitags, index) => (
                            <div className="col-md-2" key={index}>
                              <div className="tags-links">
                                <Link
                                  to={`/shop?tag_id=${
                                    tagIds.includes(multitags.id)
                                      ? tagIds
                                      : multitags.id
                                  }`}
                                  onClick={() => handleTag(multitags.id)}
                                >
                                  {multitags.name}
                                </Link>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <Link
                            className={
                              currentRoute === "/shop"
                                ? "nav-link active tag-shop-link"
                                : "nav-link"
                            }
                            style={{ fontSize: "17px", fontWeight: "800" }}
                            to="/shop"
                            onClick={handleNavClick}
                          >
                            All Jwellery
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </li>

                <li className="nav-item">
                  <Link
                    className={
                      currentRoute === "/about" ? "nav-link active" : "nav-link"
                    }
                    to="/about"
                    onClick={handleNavClick}
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <Link className="navbar-brand m-0" to="/">
              <img src={Logo} alt="logo" width={100} />
            </Link>

            <div className="header_icon">
              <ul>
                <li className="m-0">
                  {Dealer && (
                    <ul>
                      <li className="login_user" id="user-profile">
                        <div
                          class="profile"
                          onClick={toggleMenu}
                          ref={dropdownRef}
                        >
                          <div
                            className={`menu ${isMenuActive ? "active" : ""}`}
                          >
                            <ul>
                              <li>
                                <Link to="/dealer_profile">
                                  <FaUser /> My Profile
                                </Link>
                              </li>
                              <li>
                                <Link to="/my_orders">
                                  <FaCartShopping /> My Orders
                                </Link>
                              </li>
                              <li>
                                <Link to="/dealer_wishlist">
                                  <FaStar /> My Selections
                                </Link>
                              </li>
                              <li>
                                <Link to="/Dealer_login" onClick={handleLogout}>
                                  <IoLogOut />
                                  Logout
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div class="img-box">
                            {dealerData?.profile ? (
                              <img
                                src={dealerData?.profile}
                                alt=""
                                className="uploaded-image w-100"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <>
                                <img
                                  src={NOimage}
                                  alt=""
                                  className="uploaded-image w-100"
                                  style={{
                                    borderRadius: "50%",
                                  }}
                                />
                              </>
                            )}
                          </div>
                          <div class="user">
                            {dealerData?.name ? (
                              <span className="ms-2">
                                <b
                                  style={{
                                    fontSize: "20px",
                                  }}
                                >
                                  {dealerData?.name}
                                  <IoMdArrowDropdown />
                                </b>
                              </span>
                            ) : (
                              <>
                                <span className="ms-2">
                                  <b
                                    style={{
                                      fontSize: "20px",
                                    }}
                                  >
                                    Hello! Dealer
                                    <IoMdArrowDropdown />
                                  </b>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                  {Phone && (
                    <ul>
                      <li>
                        {Phone && (
                          <Link
                            className="icon"
                            to="/wishlist"
                            data-tooltip-id="my-tooltip-2"
                          >
                            <BsHeart
                              style={{ fontSize: "20px", color: "black" }}
                            />

                            {wishliststate.wishlistItems > 0 && (
                              <div className="cart_count">
                                {wishliststate.wishlistItems}
                              </div>
                            )}
                          </Link>
                        )}
                      </li>
                      <li>
                        {Phone && (
                          <Link
                            className="icon"
                            to="/cart"
                            data-tooltip-id="my-tooltip-3"
                          >
                            <BsHandbag
                              style={{ fontSize: "20px", color: "black" }}
                            />
                            {cartstate.cartItems > 0 && (
                              <div className="cart_count">
                                {cartstate.cartItems}
                              </div>
                            )}
                          </Link>
                        )}
                      </li>
                      <li className="login_user" id="user-profile">
                        <div
                          class="profile"
                          onClick={toggleMenu}
                          ref={dropdownRef}
                        >
                          <div
                            className={`menu ${isMenuActive ? "active" : ""}`}
                          >
                            <ul>
                              <li>
                                <Link to="/profile">
                                  <FaUser />
                                  My Profile
                                </Link>
                              </li>
                              <li>
                                <Link to="/my_orders">
                                  <FaCartShopping />
                                  My Orders
                                </Link>
                              </li>
                              <li>
                                <Link to="/login" onClick={handleLogout}>
                                  <IoLogOut />
                                  Logout
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div class="img-box">
                            {image?.length ? (
                              <img
                                src={image}
                                alt=""
                                className="uploaded-image w-100"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <img
                                src={NOimage}
                                alt=""
                                className="uploaded-image w-100"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </div>
                          <div class="user">
                            {profileData?.length ? (
                              <span className="ms-2">
                                <b
                                  style={{
                                    fontSize: "20px",
                                  }}
                                >
                                  {profileData}
                                  <IoMdArrowDropdown />
                                </b>
                              </span>
                            ) : (
                              <>
                                <span className="ms-2">
                                  <b
                                    style={{
                                      fontSize: "20px",
                                    }}
                                  >
                                    Hello! user
                                    <IoMdArrowDropdown />
                                  </b>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>

                {!(Dealer || Phone) && (
                  <li className="login_user">
                    <Link className="icon" to="/login">
                      <FaUserAlt />
                    </Link>
                  </li>
                )}

                <ReactTooltip
                  id="my-tooltip-2"
                  place="top"
                  content="wishlist"
                />
                <ReactTooltip id="my-tooltip-3" place="top" content="cart" />
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
