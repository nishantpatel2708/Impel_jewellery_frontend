import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import toast from "react-hot-toast";
import { RxChevronLeft, RxChevronRight, RxCross1 } from "react-icons/rx";
import { BsCartDash, BsHandbagFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReactLoading from "react-loading";
import { Helmet } from "react-helmet-async";
import { WishlistSystem } from "../../context/WishListContext";
import UserCartService from "../../services/Cart";
import Userservice from "../../services/Auth";
import productDetail from "../../services/Shop";
import { CartSystem } from "../../context/CartContext";

const ShopDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { dispatch: wishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: addtocartDispatch } = useContext(CartSystem);

  const { id } = useParams();
  const [product, setProduct] = useState();
  const data = { categoryId: product?.category_id?.id };
  const Dealer = localStorage.getItem("email");
  const Phone = localStorage.getItem("phone");
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [img, setImg] = useState();
  const [productImages, setProduuctImages] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [userWishlist, setUserWishlist] = useState(false);
  const [UserWishlistItems, setUserWishlistItems] = useState([]);
  const [goldColor, setGoldColor] = useState("yellow_gold");
  const [goldType, setGoldType] = useState("18k");
  const [isLoading, setIsLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);

  const productData = async () => {
    const data = {
      id: id,
    };
    await productDetail
      .product_detail(data)
      .then((res) => {
        setTimeout(() => {
          setProduct(res.data);
          setImg(res.data.image);
          setProduuctImages(res.data.multiple_image);
          setIsLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const Relatedproduct = async () => {
    try {
      const response = await productDetail.related_products(data);
      setRelatedProduct(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const GetUserCartList = async () => {
    UserCartService.CartList({ phone: Phone })
      .then((res) => {
        setCartItems(res.data.cart_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetUserWishList = async () => {
    Userservice.userWishlist({ phone: Phone })
      .then((res) => {
        setUserWishlistItems(res?.data?.wishlist_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    productData();
    Relatedproduct();
    GetUserCartList();
    GetUserWishList();
  }, []);

  const addToUserWishList = async (product) => {
    setSpinner2(true);
    const payload = { id: product?.id };
    Userservice.addtoWishlist({
      phone: localStorage.getItem("phone"),
      design_id: product?.id,
      quantity: productQuantity,
      gold_color: goldColor,
      gold_type: goldType,
      design_name: product?.name,
    })
      .then((res) => {
        if (res.success === true) {
          setUserWishlist(true);
          GetUserWishList();
          wishlistDispatch({
            type: "ADD_TO_WISHLIST",
            payload,
          });
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSpinner2(false);
      });
  };

  const handleAddToCart = (product) => {
    setSpinner(true);
    const payload = { id: product?.id };
    const CartData = {
      phone: Phone,
      design_name: product?.name,
      design_id: product?.id,
      quantity: productQuantity,
      gold_color: goldColor,
      gold_type: goldType,
    };

    const isItemInWishlist = UserWishlistItems.some(
      (wishlistItem) =>
        wishlistItem.id === product?.id &&
        wishlistItem.goldType === product?.goldType &&
        wishlistItem.goldColor === product?.goldColor
    );

    UserCartService.AddtoCart(CartData)
      .then((res) => {
        if (res.status === true) {
          GetUserCartList();
          addtocartDispatch({
            type: "ADD_TO_CART",
            payload,
          });
          if (isItemInWishlist) {
            removeWishlistDispatch({
              type: "REMOVE_FROM_WISHLIST",
              payload,
            });
          }
          toast.success(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (step) => {
    const newIndex =
      (currentImageIndex + step + productImages.length) % productImages.length;
    setCurrentImageIndex(newIndex);
  };

  const handleGoldColor = (goldType) => {
    setGoldColor(goldType);
    setGoldType("18k");
  };

  const handleGoldType = (event) => {
    setGoldType(event.target.id);
  };

  const productdetail = {
    // details for 22k gold
    gross_weight_22k: product?.gross_weight_22k?.toFixed(2),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_22k: product?.net_weight_22k?.toFixed(2),
    price_22k: product?.price_22k?.toFixed(2),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),
    making_charge: product?.making_charge?.toFixed(2),
    total_price_22k: product?.total_price_22k?.toLocaleString("en-US"),

    // details for 20k gold
    gross_weight_20k: product?.gross_weight_20k?.toFixed(2),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_20k: product?.net_weight_20k?.toFixed(2),
    price_20k: product?.price_20k?.toFixed(2),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),
    making_charge: product?.making_charge?.toFixed(2),
    total_price_20k: product?.total_price_20k?.toLocaleString("en-US"),

    // details for 18k gold
    gross_weight_18k: product?.gross_weight_18k?.toFixed(2),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_18k: product?.net_weight_18k?.toFixed(2),
    price_18k: product?.price_18k?.toFixed(2),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),
    making_charge: product?.making_charge?.toFixed(2),
    total_price_18k: product?.total_price_18k?.toLocaleString("en-US"),

    // details for 14k gold
    gross_weight_14k: product?.gross_weight_14k?.toFixed(2),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_14k: product?.net_weight_14k?.toFixed(2),
    price_14k: product?.price_14k?.toFixed(2),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),
    making_charge: product?.making_charge?.toFixed(2),
    total_price_14k: product?.total_price_14k?.toLocaleString("en-US"),
  };

  const UserLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <title>
          Impel Store - &nbsp;
          {product && product.name && product.code
            ? `${product.name} (${product.code})`
            : ""}
        </title>
        <meta name="description" content="Helmet application" />
      </Helmet>

      <section className="shop_details">
        <div className="container">
          <div className="Shop_product">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <BreadCrumb
                  firstName="Home"
                  firstUrl="/"
                  secondName="Shop"
                  secondUrl="/shop"
                  thirdName="Shopdetails"
                />
                {isLoading ? (
                  <div className="h-100 d-flex justify-content-center pt-5">
                    <ReactLoading
                      type={"spin"}
                      color={"#053961"}
                      delay={"2"}
                      height={"20%"}
                      width={"10%"}
                      className="loader"
                    />
                  </div>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div>
                          {productImages?.length === 0 ? (
                            <div id="imageMagnifyer">
                              <img src={img} alt="" className="w-100" />
                            </div>
                          ) : (
                            <div className="detalis_slider">
                              <Carousel
                                infiniteLoop
                                useKeyboardArrows
                                autoPlay
                                interval={3000}
                              >
                                {productImages?.map((image, index) => (
                                  <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                  >
                                    <img
                                      src={image}
                                      alt={`Product Image ${index}`}
                                    />
                                  </div>
                                ))}
                              </Carousel>

                              {lightboxOpen && (
                                <div className="custom-lightbox">
                                  <div className="custom_lightbox_inr">
                                    <span
                                      className="close-button"
                                      onClick={closeLightbox}
                                    >
                                      <RxCross1 />
                                    </span>
                                    <img
                                      className="w-50"
                                      src={productImages[currentImageIndex]}
                                      alt={`Product Image ${currentImageIndex}`}
                                    />
                                    <div className="lightbox-navigation">
                                      <button
                                        className="btn"
                                        onClick={() => navigateLightbox(-1)}
                                      >
                                        <RxChevronLeft />
                                      </button>
                                      <button
                                        className="btn"
                                        onClick={() => navigateLightbox(1)}
                                      >
                                        <RxChevronRight />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <h3>{product?.name}</h3>
                          <h5>
                            Design code : <strong>{product?.code}</strong>
                          </h5>
                          {product?.description && (
                            <p>{product?.description}</p>
                          )}

                          <div>
                            <div>
                              <button
                                className={`btn yellow-gold ${
                                  goldColor === "yellow_gold" ? "active" : ""
                                }`}
                                onClick={() => handleGoldColor("yellow_gold")}
                              >
                                Yellow Gold
                              </button>
                              <button
                                className={`btn rose-gold mx-3 ${
                                  goldColor === "rose_gold" ? "active" : ""
                                }`}
                                onClick={() => handleGoldColor("rose_gold")}
                              >
                                Rose Gold
                              </button>
                              <button
                                className={`btn white-gold mt-2 mt-md-0 ${
                                  goldColor === "white_gold" ? "active" : ""
                                }`}
                                onClick={() => handleGoldColor("white_gold")}
                              >
                                White Gold
                              </button>
                            </div>
                            <div className="mt-3">
                              {goldColor === "yellow_gold" && (
                                <>
                                  <div className="crt-btn">
                                    <div class="radio-item">
                                      <input
                                        name="radio1"
                                        id="22k"
                                        type="radio"
                                        checked={goldType === "22k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="22k">22K</label>
                                    </div>
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="20k"
                                        type="radio"
                                        checked={goldType === "20k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="20k">20K</label>
                                    </div>
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="18k"
                                        type="radio"
                                        defaultChecked={goldType === "18k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="18k">18K</label>
                                    </div>
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="14k"
                                        type="radio"
                                        checked={goldType === "14k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="14k">14K</label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {goldColor === "rose_gold" && (
                                <>
                                  <div className="d-flex">
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="18k"
                                        type="radio"
                                        defaultChecked={goldType === "18k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="18k">18K</label>
                                    </div>
                                    <div className="radio-item ms-3">
                                      <input
                                        name="radio1"
                                        id="14k"
                                        type="radio"
                                        checked={goldType === "14k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="14k">14K</label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {goldColor === "white_gold" && (
                                <>
                                  <div className="d-flex ">
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="18k"
                                        type="radio"
                                        defaultChecked={goldType === "18k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="18k">18K</label>
                                    </div>
                                    <div className="radio-item ms-3">
                                      <input
                                        name="radio1"
                                        id="14k"
                                        type="radio"
                                        checked={goldType === "14k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="14k">14K</label>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="mt-3">
                              {goldColor && goldType && (
                                <>
                                  <table className="table table-bordered text-center">
                                    <thead>
                                      <tr>
                                        <th colspan="3">
                                          Approximate -Estimate
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {goldType === "22k" && (
                                        <>
                                          <tr>
                                            <th>Gross Weight</th>
                                            <td>
                                              {productdetail?.gross_weight_22k}
                                              g. (Approx.)
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less Gems Stone</th>
                                            <td>
                                              {productdetail?.less_gems_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less C.Z. Stone</th>
                                            <td>
                                              {productdetail?.less_cz_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Net Weight</th>
                                            <td>
                                              {productdetail?.net_weight_22k}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Metal price</th>
                                            <td>₹{productdetail?.price_22k}</td>
                                          </tr>
                                          <tr>
                                            <th>CZ Stone Charges</th>
                                            <td>
                                              ₹{productdetail?.cz_stone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Gem stone charges</th>
                                            <td>
                                              ₹{productdetail?.gemstone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Making charge</th>
                                            <td>
                                              ₹{productdetail?.making_charge}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹{productdetail?.total_price_22k}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                      {goldType === "20k" && (
                                        <>
                                          <tr>
                                            <th>Gross Weight</th>
                                            <td>
                                              {productdetail?.gross_weight_20k}
                                              g. (Approx.)
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less Gems Stone</th>
                                            <td>
                                              {productdetail?.less_gems_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less C.Z. Stone</th>
                                            <td>
                                              {productdetail?.less_cz_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Net Weight</th>
                                            <td>
                                              {productdetail?.net_weight_20k}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Metal price</th>
                                            <td>₹{productdetail?.price_20k}</td>
                                          </tr>
                                          <tr>
                                            <th>CZ Stone Charges</th>
                                            <td>
                                              ₹{productdetail?.cz_stone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Gem stone charges</th>
                                            <td>
                                              ₹{productdetail?.gemstone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Making charge</th>
                                            <td>
                                              ₹{productdetail?.making_charge}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹{productdetail?.total_price_20k}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                      {goldType === "18k" && (
                                        <>
                                          <tr>
                                            <th>Gross Weight</th>
                                            <td>
                                              {productdetail?.gross_weight_18k}
                                              g. (Approx.)
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less Gems Stone</th>
                                            <td>
                                              {productdetail?.less_gems_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less C.Z. Stone</th>
                                            <td>
                                              {productdetail?.less_cz_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Net Weight</th>
                                            <td>
                                              {productdetail?.net_weight_18k}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Metal price</th>
                                            <td>₹{productdetail?.price_18k}</td>
                                          </tr>
                                          <tr>
                                            <th>CZ Stone Charges</th>
                                            <td>
                                              ₹{productdetail?.cz_stone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Gem stone charges</th>
                                            <td>
                                              ₹{productdetail?.gemstone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Making charge</th>
                                            <td>
                                              ₹{productdetail?.making_charge}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹{productdetail?.total_price_18k}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                      {goldType === "14k" && (
                                        <>
                                          <tr>
                                            <th>Gross Weight</th>
                                            <td>
                                              {productdetail?.gross_weight_14k}
                                              g. (Approx.)
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less Gems Stone</th>
                                            <td>
                                              {productdetail?.less_gems_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less C.Z. Stone</th>
                                            <td>
                                              {productdetail?.less_cz_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Net Weight</th>
                                            <td>
                                              {productdetail?.net_weight_14k}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Metal price</th>
                                            <td>₹{productdetail?.price_14k}</td>
                                          </tr>
                                          <tr>
                                            <th>CZ Stone Charges</th>
                                            <td>
                                              ₹{productdetail?.cz_stone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Gem stone charges</th>
                                            <td>
                                              ₹{productdetail?.gemstone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Making charge</th>
                                            <td>
                                              ₹{productdetail?.making_charge}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹{productdetail?.total_price_14k}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="button d-flex justify-content-around pt-2">
                            <div className="add_cart align-items-center d-flex">
                              {Phone ? (
                                <>
                                  {cartItems &&
                                  cartItems?.find(
                                    (item) => item.design_id === product?.id
                                  ) ? (
                                    <>
                                      <Link
                                        className="btn btn-outline-dark"
                                        to="/cart"
                                      >
                                        <BsCartDash className="me-2" /> Go To
                                        Cart
                                      </Link>
                                    </>
                                  ) : (
                                    <>
                                      <div>
                                        <button
                                          className="btn btn-outline-dark"
                                          onClick={() =>
                                            handleAddToCart(product)
                                          }
                                          disabled={spinner}
                                        >
                                          {spinner && (
                                            <CgSpinner
                                              size={20}
                                              className="animate_spin me-2"
                                            />
                                          )}
                                          {!spinner && (
                                            <BsHandbagFill className="me-2" />
                                          )}
                                          Add To Cart
                                        </button>
                                      </div>
                                      <div>
                                        <button
                                          className="btn btn-outline-dark align-items-center"
                                          onClick={() =>
                                            addToUserWishList(product)
                                          }
                                          disabled={UserWishlistItems?.find(
                                            (item) => item?.id === product?.id
                                          )}
                                        >
                                          {UserWishlistItems?.find(
                                            (item) => item?.id === product?.id
                                          ) ? (
                                            <div className="btn-success">
                                              <FaHeart className="me-2" />
                                              WISHLISTED
                                            </div>
                                          ) : (
                                            <div className="btn-success">
                                              {spinner2 && (
                                                <CgSpinner
                                                  size={20}
                                                  className="animate_spin me-2"
                                                />
                                              )}
                                              {!spinner2 && (
                                                <FaRegHeart className="me-2" />
                                              )}
                                              Add To Wishlist
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {Dealer ? (
                                    <></>
                                  ) : (
                                    <div
                                      class="buttons d-flex"
                                      onClick={(e) => UserLogin(e)}
                                    >
                                      <div class="add_cart align-items-center d-flex">
                                        <div>
                                          <button class="btn btn-outline-dark">
                                            <BsHandbagFill className="me-2" />
                                            Add To Cart
                                          </button>
                                        </div>
                                        <div>
                                          <button class="btn btn-outline-dark align-items-center">
                                            <FaRegHeart className="me-2" />
                                            Add To Wishlist
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default ShopDetails;
