import React, { useContext, useState, useEffect } from "react";
import Userservice from "../../services/Auth";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { CgSpinner } from "react-icons/cg";
import { WishlistSystem } from "../../context/WishListContext";
import UserCartService from "../../services/Cart";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import emptycart from "../../assets/images/empty-cart.png";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import { CartSystem } from "../../context/CartContext";

const WishList = () => {
  const phone = localStorage.getItem("phone");
  const { dispatch: addtocartDispatch } = useContext(CartSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);

  const [items, setItems] = useState([]);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [removeCartItems, setRemoveCartItems] = useState(null);

  const GetUserWishlist = async () => {
    Userservice.userWishlist({ phone: phone })
      .then((res) => {
        setItems(res?.data?.wishlist_items);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const GetUserCartList = async () => {
    UserCartService.CartList({ phone: phone })
      .then((res) => {
        setCartItems(res.data.cart_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeFromWishList = (id) => {
    const payload = id;
    setRemovingItemId(id);
    Userservice.removetoWishlist({ phone: phone, design_id: id })
      .then((res) => {
        if (res.success === true) {
          GetUserWishlist();
          setIsLoading(true);
          toast.success(res.message);
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  const handleAddToCart = (product) => {
    const payload = { id: product.id };
    setRemoveCartItems(product);
    const CartData = {
      phone: phone,
      design_name: product.name,
      design_id: product.id,
      quantity: productQuantity,
      gold_color: product?.gold_color,
      gold_type: product?.gold_type,
    };

    UserCartService.AddtoCart(CartData)
      .then((res) => {
        if (res.status === true) {
          GetUserCartList();
          GetUserWishlist();
          addtocartDispatch({
            type: "ADD_TO_CART",
            payload,
          });
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
          toast.success(res.message);

          setIsLoading(true);
        } else {
          toast.error(res.message);
          GetUserWishlist();
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
          setIsLoading(true);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemoveCartItems(null);
      });
  };

  useEffect(() => {
    GetUserWishlist();
    GetUserCartList();
  }, []);

  const goldColor = {
    yellow_gold: "Yellow Gold",
    rose_gold: "Rose Gold",
    white_gold: "White Gold",
  };

  return (
    <>
      <Helmet>
        <title>Impel Store - Wishlist</title>
      </Helmet>
      <section className="wishlist">
        <div className="container">
          <h2 className="text-center pb-3 text-uppercase fw-bolder">
            My Wishlist
          </h2>
          <div>
            {isLoading ? (
              <div className="h-100 d-flex justify-content-center">
                <ReactLoading
                  type={"spin"}
                  color={"#053961"}
                  height={"20%"}
                  width={"10%"}
                  className="loader"
                />
              </div>
            ) : (
              <>
                {items?.length ? (
                  <>
                    <div className="new-wishlist-section">
                      <div className="row">
                        {items?.map((product) => {
                          return (
                            <div class="col-md-6 col-lg-3">
                              <div className="card">
                                <img
                                  class=""
                                  src={product?.image}
                                  alt={product?.name}
                                />
                                <div class="card-body text-center">
                                  <div class="cvp">
                                    <h5 class="card-title fw-bolder">
                                      <Link
                                        to={`/shopdetails/${product?.id}`}
                                        className="product_data"
                                      >
                                        {product?.name}
                                      </Link>
                                    </h5>
                                    <p>{goldColor[product.gold_color]}</p>
                                    <p>{product.gold_type}</p>
                                    <div className="wishlist_item_btn">
                                      <button
                                        class="btn btn-danger remove"
                                        onClick={() =>
                                          removeFromWishList(product?.id)
                                        }
                                      >
                                        {removingItemId === product.id && (
                                          <CgSpinner
                                            size={20}
                                            className="animate_spin me-2"
                                          />
                                        )}
                                        {removingItemId === product.id ? (
                                          ""
                                        ) : (
                                          <>
                                            <AiFillDelete className="me-1" />
                                          </>
                                        )}
                                        REMOVE
                                      </button>

                                      <button
                                        class="btn btn-dark add-cart"
                                        onClick={() => handleAddToCart(product)}
                                      >
                                        {removeCartItems === product && (
                                          <CgSpinner
                                            size={20}
                                            className="animate_spin me-2"
                                          />
                                        )}
                                        {removeCartItems === product ? (
                                          ""
                                        ) : (
                                          <>
                                            <FaCartShopping className="me-1" />
                                          </>
                                        )}
                                        MOVE TO CART
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <div className="card border shadow-sm p-4">
                          <div className="text-center my-4">
                            <img
                              src={emptycart}
                              alt="Empty Cart Illustration"
                              className="img-fluid mb-3"
                              style={{ maxWidth: "200px" }}
                            />
                            <h5 className="text-muted mb-3">
                              Oops! Your Wishlist is empty.
                            </h5>
                            <p className="text-muted">
                              Explore our collection and add your favourite
                              products in your wishlist
                            </p>
                          </div>

                          <div className="text-center">
                            <Link
                              to="/shop"
                              className="view_all_btn px-4 py-2"
                              style={{ borderRadius: "8px" }}
                            >
                              <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back
                              to Shop
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default WishList;
