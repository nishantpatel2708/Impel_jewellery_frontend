import React, { useEffect, useState } from "react";
import emptycart from "../../assets/images/empty-cart.png";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaLongArrowAltLeft } from "react-icons/fa";
import DealerWishlist from "../../services/Dealer/Collection";
import { Helmet } from "react-helmet-async";
import { AiFillDelete } from "react-icons/ai";

const DealerWishList = () => {
  const DealerEmail = localStorage.getItem("email");
  const [checkList, setCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null);

  const collectionCheck = () => {
    DealerWishlist.ListCollection({ email: DealerEmail })
      .then((res) => {
        setIsLoading(false);
        setCheckList(res.data?.wishlist_items);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const removeFromWishList = (product) => {
    setRemovingItemId(product);
    DealerWishlist.removetodealerWishlist({
      email: DealerEmail,
      design_id: product,
    })
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          collectionCheck();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  useEffect(() => {
    collectionCheck();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - Dealer Wishlist</title>
      </Helmet>
      <section className="wishlist">
        <div className="container">
          <h2>My Selections</h2>
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
              {checkList?.length ? (
                <>
                  <div className="new-wishlist-section">
                    <div className="row">
                      {checkList?.map((product) => {
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

                                  <div className="wishlist_item_btn">
                                    <button
                                      class="btn btn-danger remove"
                                      onClick={() =>
                                        removeFromWishList(product?.id)
                                      }
                                    >
                                      {removingItemId === product?.id && (
                                        <CgSpinner
                                          size={20}
                                          className="animate_spin me-2"
                                        />
                                      )}
                                      <AiFillDelete className="me-1" />
                                      REMOVE
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
                            Oops! Your Selections is empty.
                          </h5>
                          <p className="text-muted">
                            Explore our collection and add your favourite
                            products in your Selections
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
      </section>
    </>
  );
};

export default DealerWishList;
