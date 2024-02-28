import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsHeart, BsSearch } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { FaRegStar, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ReactLoading from "react-loading";
import Select from "react-select";
import Accordion from "react-bootstrap/Accordion";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Helmet } from "react-helmet-async";
import ShopServices from "../../services/Shop";
import FilterServices from "../../services/Filter";
import DealerWishlist from "../../services/Dealer/Collection";
import UserWishlist from "../../services/Auth";
import { WishlistSystem } from "../../context/WishListContext";

const Shop = () => {
  const { dispatch: wishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);

  const location = useLocation();
  const navigate = useNavigate();

  const userType = localStorage.getItem("user_type");
  const userId = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");
  const Phone = localStorage.getItem("phone");

  const [searchInput, setSearchInput] = useState(null);

  const [selectedOption, setSelectedOption] = useState([]);

  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [genderData, setGenderData] = useState([]);
  const [gender, setGender] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const [filterTag, setFilterTag] = useState([]);
  const [tag, setTag] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  const [PriceRange, setPriceRange] = useState({
    minprice: null,
    maxprice: null,
  });

  const [FilterPriceRange, setFilterPriceRange] = useState({
    minprice: 0,
    maxprice: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [filterData, setFilterData] = useState([]);
  const [paginate, setPaginate] = useState();

  const [collection_status, setCollectionStatus] = useState(false);
  const [DealerCollection, setDealerCollection] = useState([]);

  const [userWishlist, setUserWishlist] = useState(false);
  const [goldColor, setGoldColor] = useState("yellow_gold");
  const [goldType, setGoldType] = useState("18k");
  const [UsercartItems, setUserCartItems] = useState([]);

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // sort by searching
  const searchbar = (e) => {
    setIsLoading(true);
    setSearchInput(e.target.value);
  };

  // sort by dropdown functions
  const options = [
    { value: "new_added", label: "New Added" },
    { value: "low_to_high", label: "Price : low to high" },
    { value: "high_to_low", label: "Price : high to low" },
    { value: "highest_selling", label: "Top Seller" },
  ];

  const handleSelectChange = (selectedSort) => {
    setIsLoading(true);
    setSelectedOption(selectedSort);
  };

  // 4 Filter APIS call
  const CategoryFilter = () => {
    FilterServices.categoryFilter()
      .then((res) => {
        setCategoryData(res.data);
      })
      .catch((error) => console.log(error));
  };

  const GenderFilter = () => {
    FilterServices.genderFilter()
      .then((res) => {
        setGenderData(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleSelectCategory = async (selectedCategory) => {
    setIsLoading(true);

    setSelectedOption("");

    setGender(null);
    setSelectedGender(null);

    setTag([]);
    setSelectedTag(null);
    navigate(`/shop`);

    setPriceRange("");

    setCategory(selectedCategory ? selectedCategory.value : null);
    setSelectedCategory(selectedCategory);
  };

  const handleSelectGender = (selectedGender) => {
    setIsLoading(true);
    setGender(selectedGender ? selectedGender.value : null);
    setSelectedGender(selectedGender);
  };

  const handleSelectTag = (selectedTags) => {
    setIsLoading(true);

    const selectedTagId = selectedTags ? parseFloat(selectedTags.value) : null;

    if (selectedTagId !== null) {
      setTag([selectedTagId]);
      setSelectedTag(selectedTags);
      navigate(`/shop?tag_id=${selectedTagId}`);
    } else {
      setTag([]);
      setSelectedTag(null);
      navigate(`/shop`);
    }
  };

  const handleSliderChange = (e) => {
    setIsLoading(true);
    setPriceRange({ minprice: e[0], maxprice: e[1] });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagIds = searchParams.getAll("tag_id");

    if (tagIds && tagIds.length > 0) {
      setIsLoading(true);

      try {
        const parsedTagIds = tagIds[0].split(",").map((id) => parseFloat(id));
        setTag(parsedTagIds);

        if (parsedTagIds && parsedTagIds.length > 0) {
          const tag = filterTag?.find((item) => item.id === parsedTagIds[0]);

          if (tag) {
            setSelectedTag({ value: tag.id, label: tag.name });
          } else {
            console.error("Tag not found with ID:", parsedTagIds[0]);
          }
        }
      } catch (error) {
        console.error("Error parsing tag IDs:", error);
        setTag([]);
      }
    } else {
      setTag([]);
    }
  }, [location.search]);

  const FilterData = (offset = 0) => {
    ShopServices.allfilterdesigns({
      category_id: category,
      gender_id: gender,
      tag_id: tag,
      search: searchInput,
      min_price: PriceRange?.minprice,
      max_price: PriceRange?.maxprice,
      sort_by: selectedOption?.value,
      userType: userType,
      userId: userId,
      offset: offset,
    })
      .then((res) => {
        setIsLoading(false);
        setFilterData(res.data?.designs);
        setFilterTag(res.data?.tags);
        setPaginate(res.data);
        setFilterPriceRange({
          minprice: res.data.minprice,
          maxprice: res.data.maxprice,
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    FilterData(0);
    resetPagination();
  }, [category, tag, gender, searchInput, PriceRange, selectedOption]);

  useEffect(() => {
    if (Phone) {
      GetUserWishList();
    }

    if (email) {
      GetDealerSelection();
    }

    CategoryFilter();
    GenderFilter();
  }, []);

  // user wishlist API
  const GetUserWishList = async () => {
    UserWishlist.userWishlist({ phone: Phone })
      .then((res) => {
        setUserCartItems(res?.data?.wishlist_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // user wishlist products add
  const addToUserWishList = async (e, product) => {
    e.preventDefault();
    const payload = { id: product?.id };
    if (!UsercartItems.some((item) => item.id === product.id)) {
      UserWishlist.addtoWishlist({
        phone: Phone,
        design_id: product.id,
        gold_color: goldColor,
        gold_type: goldType,
        design_name: product?.name,
      })
        .then((res) => {
          if (res.success === true) {
            setUserWishlist(true);
            toast.success("Design has been Added to Your Wishlist");
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
        });
    } else {
    }
  };

  // user wishlist products remove
  const removeFromWishList = (e, product) => {
    e.preventDefault();
    const payload = product;
    UserWishlist.removetoWishlist({
      phone: Phone,
      design_id: product.id,
      gold_color: goldColor,
      gold_type: goldType,
      design_name: product?.name,
    })
      .then((res) => {
        if (res.success === true) {
          toast.success("Design has been Removed from Your Wishlist.");
          GetUserWishList();
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Dealer wishlist API
  const GetDealerSelection = () => {
    DealerWishlist.ListCollection({ email: email })
      .then((res) => {
        setDealerCollection(res.data?.wishlist_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Dealer Wishlist products add
  const AddToDealerSelection = async (e, product) => {
    e.preventDefault();
    if (!DealerCollection?.some((item) => item.id === product?.id)) {
      DealerWishlist.addtoDealerWishlist({
        email: email,
        design_id: product?.id,
      })
        .then((res) => {
          if (res.success === true) {
            setCollectionStatus(true);
            toast.success("Design has been Added to Your Collection.");
            FilterData();
            GetDealerSelection();
            resetPagination();
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  };

  // Dealer Wishlist products remove
  const removeFromSelection = (e, product) => {
    e.preventDefault();
    DealerWishlist.removetodealerWishlist({
      email: localStorage.getItem("email"),
      design_id: product.id,
    })
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          FilterData();
          GetDealerSelection();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // PAGINATION FUNCTION
  const totalPages = Math.ceil(paginate?.total_records / 20);

  const [pagination, setPagination] = useState({});

  const resetPagination = () => {
    setPagination({
      currentPage: 1,
      dataShowLength: 20,
    });
  };

  const paginationPage = (page) => {
    const newOffset = (page - 1) * pagination.dataShowLength;
    FilterData(newOffset);
    setPagination({ ...pagination, currentPage: page });
    scrollup();
    setIsLoading(true);
  };

  const paginationPrev = () => {
    if (pagination.currentPage > 1) {
      const prevPage = pagination.currentPage - 1;
      const newOffset = (prevPage - 1) * pagination.dataShowLength;
      FilterData(newOffset);
      setPagination({ ...pagination, currentPage: prevPage });
      scrollup();
      setIsLoading(true);
    }
  };

  const paginationNext = () => {
    if (pagination.currentPage < totalPages) {
      const nextPage = pagination.currentPage + 1;
      const newOffset = (nextPage - 1) * pagination.dataShowLength;
      FilterData(newOffset);
      setPagination({ ...pagination, currentPage: nextPage });
      scrollup();
      setIsLoading(true);
    }
  };

  const UserLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/login");
  };

  const DealerLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", location.pathname);
    navigate("/Dealer_login");
  };

  return (
    <>
      <Helmet>
        <title>Impel Store - Shop</title>
      </Helmet>
      <section className="shop">
        <div className="container">
          <div className="shopping_data">
            <div className="row">
              <div className="col-md-9 col-7">
                <div className="search_bar">
                  <input
                    className="form-control"
                    placeholder="Search by design code"
                    onChange={(e) => searchbar(e)}
                    type="search"
                  />
                  {searchInput?.length === 0 && (
                    <BsSearch className="search-icon" />
                  )}
                </div>
              </div>
              <div className="col-md-3 col-5">
                <Select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  isClearable={true}
                  isSearchable={false}
                  options={options}
                  placeholder="Sort By"
                />
              </div>
            </div>

            <div className="">
              <div className="row">
                <div className="col-md-3 col-12 mt-2 mt-md-2">
                  <Select
                    placeholder="Shop by category"
                    isClearable={true}
                    isSearchable={false}
                    value={selectedCategory}
                    options={categoryData.map((data) => ({
                      value: data?.id,
                      label: data?.name,
                    }))}
                    onChange={handleSelectCategory}
                  />
                </div>
                <div className="col-md-3 col-6 mt-2 mt-md-2">
                  <Select
                    placeholder="Shop by Gender"
                    isClearable
                    isSearchable={false}
                    value={selectedGender}
                    options={genderData?.map((data) => ({
                      value: data?.id,
                      label: data?.name,
                    }))}
                    onChange={handleSelectGender}
                  />
                </div>
                <div className="col-md-3 col-6 mt-2 mt-md-2">
                  <Select
                    placeholder="Shop by Tag"
                    isClearable
                    isSearchable={false}
                    value={selectedTag}
                    options={filterTag?.map((data) => ({
                      value: data?.id,
                      label: data?.name,
                    }))}
                    onChange={handleSelectTag}
                  />
                </div>
                <div className="col-md-3 col-12 mt-md-0">
                  <Accordion className="accordian">
                    <Accordion.Item eventKey="3" className="my-2">
                      <Accordion.Header>Shop by price</Accordion.Header>
                      <Accordion.Body className="p-4 mb-2">
                        <div className="d-flex justify-content-between">
                          <p>
                            From :
                            <strong>
                              ₹
                              {PriceRange?.minprice
                                ? PriceRange?.minprice
                                : FilterPriceRange.minprice}
                            </strong>
                          </p>
                          <p>
                            To :
                            <strong>
                              ₹
                              {PriceRange?.maxprice
                                ? PriceRange?.maxprice
                                : FilterPriceRange.maxprice}
                            </strong>
                          </p>
                        </div>
                        <Slider
                          range
                          allowCross={false}
                          min={FilterPriceRange.minprice}
                          max={FilterPriceRange.maxprice}
                          marks={{
                            [FilterPriceRange?.minprice]: "Min",
                            [FilterPriceRange?.maxprice]: "Max",
                          }}
                          onAfterChange={handleSliderChange}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-12">
                {isLoading ? (
                  <div className="d-flex justify-content-center pt-5">
                    <ReactLoading
                      type={"spinningBubbles"}
                      color={"#053961"}
                      height={"20%"}
                      width={"10%"}
                      className="loader pt-5"
                    />
                  </div>
                ) : (
                  <>
                    {filterData?.length > 0 ? (
                      <>
                        <div className="row">
                          {filterData?.map((data) => {
                            return (
                              <div className="col-md-3">
                                <Link
                                  to={`/shopdetails/${data.id}`}
                                  className="product_data"
                                  target="_blank"
                                >
                                  {data.image ? (
                                    <img
                                      src={data.image}
                                      key={data.id}
                                      alt=""
                                      className="w-100"
                                      // loading="lazy"
                                    />
                                  ) : (
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                                      alt=""
                                      className="w-100"
                                    />
                                  )}
                                  <div className="edit">
                                    <div>
                                      {userType === 1 ? (
                                        <>
                                          {email ? (
                                            <Link
                                              to="#"
                                              data-tooltip-id="my-tooltip-12"
                                              onClick={(e) => {
                                                if (
                                                  DealerCollection?.find(
                                                    (item) =>
                                                      item?.id === data?.id
                                                  )
                                                ) {
                                                  removeFromSelection(e, data);
                                                } else {
                                                  AddToDealerSelection(e, data);
                                                }
                                              }}
                                            >
                                              {DealerCollection?.find(
                                                (item) => item?.id === data?.id
                                              ) ? (
                                                <FaStar />
                                              ) : (
                                                <FaRegStar />
                                              )}
                                            </Link>
                                          ) : (
                                            <span
                                              onClick={(e) => DealerLogin(e)}
                                              data-tooltip-id="my-tooltip-12"
                                            >
                                              <FaRegStar />
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {Phone ? (
                                            <Link
                                              to="#"
                                              data-tooltip-id="my-tooltip-9"
                                              onClick={(e) => {
                                                if (
                                                  UsercartItems?.find(
                                                    (item) =>
                                                      item.id === data.id
                                                  )
                                                ) {
                                                  removeFromWishList(e, data);
                                                } else {
                                                  addToUserWishList(e, data);
                                                }
                                              }}
                                            >
                                              {UsercartItems?.find(
                                                (item) => item.id === data.id
                                              ) ? (
                                                <FcLike />
                                              ) : (
                                                <BsHeart />
                                              )}
                                            </Link>
                                          ) : (
                                            <span
                                              onClick={(e) => UserLogin(e)}
                                              data-tooltip-id="my-tooltip-9"
                                            >
                                              <BsHeart />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="product_details d-flex justify-content-between">
                                    <h4>{data?.name}</h4>
                                    <h4>
                                      <b>{data?.code}</b>
                                    </h4>
                                  </div>
                                  <div className="product_details">
                                    <h5>
                                      ₹
                                      {data?.price_18k?.toLocaleString("en-US")}
                                    </h5>
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-5">
                          {totalPages > 1 && (
                            <div className="paginationArea">
                              <nav aria-label="navigation">
                                <ul className="pagination">
                                  {/* Previous Page Button */}
                                  <li
                                    className={`page-item ${
                                      pagination.currentPage === 1
                                        ? "disabled"
                                        : ""
                                    }`}
                                    style={{
                                      display:
                                        pagination.currentPage === 1
                                          ? "none"
                                          : "block",
                                    }}
                                  >
                                    <Link
                                      to="#"
                                      className="page-link"
                                      onClick={paginationPrev}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                      >
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                      </svg>
                                      Prev
                                    </Link>
                                  </li>

                                  {/* Display pages with ellipses */}
                                  {Array.from({ length: totalPages }).map(
                                    (_, index) => {
                                      const pageNumber = index + 1;
                                      const isCurrentPage =
                                        pagination.currentPage === pageNumber;

                                      // Display first and last pages
                                      if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >=
                                          pagination.currentPage - 1 &&
                                          pageNumber <=
                                            pagination.currentPage + 1)
                                      ) {
                                        return (
                                          <li
                                            key={pageNumber}
                                            className={`page-item ${
                                              isCurrentPage ? "active" : ""
                                            }`}
                                          >
                                            <button
                                              className="page-link"
                                              onClick={() =>
                                                paginationPage(pageNumber)
                                              }
                                            >
                                              {pageNumber}
                                            </button>
                                          </li>
                                        );
                                      }

                                      // Display ellipses
                                      if (
                                        index === 1 ||
                                        index === totalPages - 2
                                      ) {
                                        return (
                                          <li
                                            key={pageNumber}
                                            className="page-item disabled"
                                          >
                                            <button className="page-link">
                                              ...
                                            </button>
                                          </li>
                                        );
                                      }

                                      return null;
                                    }
                                  )}

                                  {/* Next Page Button */}
                                  <li
                                    className={`page-item ${
                                      pagination.currentPage === totalPages
                                        ? "disabled"
                                        : ""
                                    }`}
                                    style={{
                                      display:
                                        pagination.currentPage === totalPages
                                          ? "none"
                                          : "block",
                                    }}
                                  >
                                    <Link
                                      to="#"
                                      className="page-link"
                                      onClick={paginationNext}
                                    >
                                      Next
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                      >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                      </svg>
                                    </Link>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="not-products">
                        <p>No products available.</p>
                      </div>
                    )}
                  </>
                )}
                <ReactTooltip id="my-tooltip-7" place="top" content="cart" />
                <ReactTooltip
                  id="my-tooltip-9"
                  place="bottom"
                  content="wishlist"
                />
                <ReactTooltip
                  id="my-tooltip-12"
                  place="bottom"
                  content="My Selections"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
