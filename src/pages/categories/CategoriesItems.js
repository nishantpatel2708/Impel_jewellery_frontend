import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb";
import ReactLoading from "react-loading";
import { FaLongArrowAltLeft } from "react-icons/fa";
import homeService from "../../services/Home";
import categoryDetail from "../../services/Shop";

const CategoriesItems = () => {
  const paramId = useParams();
  const [category, SetCategory] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesData, setCategoriesData] = useState([]);
  const [paginate, setPaginate] = useState();
  const [offset, setOffset] = useState();

  const Category = () => {
    homeService
      .category()
      .then((res) => {
        SetCategory(res.data);
        if (selectedCategory === 0) {
          res.data.map((i) => {
            if (i.id === Number(paramId.id)) {
              setselectedCategory(i.child_categories[0].id);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const CategoriesData = (offset = 0) => {
    categoryDetail
      .related_products({ categoryId: paramId, offset: offset })
      .then((res) => {
        setCategoriesData(res.data.designs);
        setIsLoading(false);
        setPaginate(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    Category();
    CategoriesData();
  }, [selectedCategory]);

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const totalPages = Math.ceil(paginate?.total_records / 20);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 20,
  });

  const paginationPage = (page) => {
    const calculatedOffset = (page - 1) * pagination.dataShowLength;
    setOffset(calculatedOffset);
    CategoriesData(calculatedOffset);
    setPagination({ ...pagination, currentPage: page });
    scrollup();
    setIsLoading(true);
  };

  const paginationPrev = () => {
    if (pagination.currentPage > 1) {
      const prevPage = pagination.currentPage - 1;
      const calculatedOffset = (prevPage - 1) * pagination.dataShowLength;
      setPagination({ ...pagination, currentPage: prevPage });
      setOffset(calculatedOffset);
      CategoriesData(calculatedOffset);
      scrollup();
      setIsLoading(true);
    }
  };

  const paginationNext = () => {
    if (pagination.currentPage < totalPages) {
      const nextPage = pagination.currentPage + 1;
      const calculatedOffset = (nextPage - 1) * pagination.dataShowLength;
      setPagination({ ...pagination, currentPage: nextPage });
      setOffset(calculatedOffset);
      CategoriesData(calculatedOffset);
      scrollup();
      setIsLoading(true);
    }
  };

  return (
    <section className="categories">
      <div className="container">
        <div className="subcategory_filter">
          {category.map((data, index) => {
            return (
              <>
                {data.id === Number(paramId.id) && (
                  <section className="sec_main product_sec" key={index}>
                    <BreadCrumb
                      firstName="Home"
                      firstUrl="/"
                      secondName="Categories"
                      secondUrl="/categories"
                      thirdName={data.name}
                    />
                    <ul className="nav nav-tabs">
                      {data.child_categories.map((item, index) => {
                        return <></>;
                      })}
                    </ul>
                  </section>
                )}
              </>
            );
          })}
        </div>
        <div>
          <div className="categories_data">
            <div className="row">
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
                  {categoriesData.length > 0 ? (
                    categoriesData.map((data) => {
                      return (
                        <>
                          <div className="col-md-3" key={data.id}>
                            <Link
                              to={`/shopdetails/${data.id}`}
                              className="text-decoration-none"
                              style={{ color: "#000" }}
                              target="_blank"
                            >
                              <div className="category_data py-2">
                                <img
                                  src={data.image}
                                  alt=""
                                  className="w-100"
                                />
                                <div className="product_details d-flex justify-content-between">
                                  <h4>{data?.name}</h4>
                                  <h4>
                                    <b>{data?.code}</b>
                                  </h4>
                                </div>
                                <div className="product_details">
                                  <h5>
                                    ₹
                                    {data?.total_price_18k?.toLocaleString(
                                      "en-US"
                                    )}
                                  </h5>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <div
                        className="categoriesData-not text-center"
                        style={{
                          fontSize: "35px",
                          fontWeight: "600",
                          marginTop: "150px",
                        }}
                      >
                        <p>
                          Unfortunately, categories data is not available at the
                          moment.
                        </p>
                      </div>
                      <div className="text-center mt-md-3">
                        <Link
                          to="/categories"
                          className="view_all_btn px-4 py-2"
                          style={{ borderRadius: "8px" }}
                        >
                          <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back to
                          Categories
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="pt-5">
              {totalPages > 1 && (
                <div className="paginationArea">
                  <nav aria-label="navigation">
                    <ul className="pagination">
                      {/* Previous Page Button */}
                      <li
                        className={`page-item ${
                          pagination.currentPage === 1 ? "disabled" : ""
                        }`}
                        style={{
                          display:
                            pagination.currentPage === 1 ? "none" : "block",
                        }}
                      >
                        <a className="page-link" onClick={paginationPrev}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                          Prev
                        </a>
                      </li>

                      {/* Display pages with ellipses */}
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage =
                          pagination.currentPage === pageNumber;

                        // Display first and last pages
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= pagination.currentPage - 1 &&
                            pageNumber <= pagination.currentPage + 1)
                        ) {
                          return (
                            <li
                              key={pageNumber}
                              className={`page-item ${
                                isCurrentPage ? "active" : ""
                              }`}
                              onClick={() => paginationPage(pageNumber)}
                            >
                              <a className="page-link">{pageNumber}</a>
                            </li>
                          );
                        }

                        // Display ellipses
                        if (index === 1 || index === totalPages - 2) {
                          return (
                            <li key={pageNumber} className="page-item disabled">
                              <a className="page-link">...</a>
                            </li>
                          );
                        }

                        return null;
                      })}

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
                        <a className="page-link" onClick={paginationNext}>
                          Next
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CategoriesItems;
