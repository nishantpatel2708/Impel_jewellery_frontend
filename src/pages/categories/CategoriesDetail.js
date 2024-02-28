import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb";
import { Helmet } from "react-helmet-async";
import categoryDetail from "../../services/Shop";

const CategoriesDetail = () => {
  const paramId = useParams();
  const [categoriesDetail, setCategoriesDetail] = useState([]);
  const [name, setName] = useState("");

  const CategoriesData = () => {
    categoryDetail
      .related_products({ categoryId: paramId })
      .then((res) => {
        setCategoriesDetail(res.data);
        setName(res.category_name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    CategoriesData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Impel Store - Categories</title>
      </Helmet>
      <section className="categories">
        <div className="container">
          <div className="d-flex align-itmes-center justify-content-between pb-2">
            <h3>{name}</h3>

            <BreadCrumb
              firstName="Home"
              firstUrl="/"
              secondName="Categories"
              secondUrl="/categories"
              thirdName="CategoryDetails"
            />
          </div>
          <div className="category_detail">
            {categoriesDetail.map((data) => {
              return (
                <>
                  <div className="category_data py-2">
                    <Link
                      to={`/shopdetails/${data.id}`}
                      className="text-decoration-none"
                      style={{ color: "#000" }}
                    >
                      <img src={data?.image} alt="" className="w-100" />
                      <div className="product_details">
                        <h4>{data?.name}</h4>
                      </div>
                    </Link>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesDetail;
