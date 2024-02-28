import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { Helmet } from "react-helmet-async";
import categoriesService from "../../services/Home";

const Categories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = () => {
    categoriesService
      .category()
      .then((res) => {
        setIsLoading(false);
        setAllCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    categories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - All Categories</title>
      </Helmet>
      <section className="categories">
        <div className="container">
          <div className="categories_header">
            <h3>Categories</h3>
          </div>
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
            <div className="categories_data_main">
              <div className="row">
                {allCategories.map((data, index) => {
                  return (
                    <div className="col-md-3" key={index}>
                      <Link
                        to={`/categories/${data.id}`}
                        className="text-decoration-none"
                        style={{ color: "#000" }}
                      >
                        <div className="category_data_item">
                          <img src={data?.image} className="w-100" alt="" />
                          <div className="product_details">
                            <h4 className="fw-bolder">{data?.name}</h4>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default Categories;
