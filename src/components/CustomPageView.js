import React, { useEffect, useState } from "react";
import profileService from "../services/Home";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { Helmet } from "react-helmet-async";

const CustomPageView = () => {
  const paramId = useParams();
  const [pageDetails, setPageDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const CustomPages = () => {
    profileService
      .CustomPages({ page_slug: paramId })
      .then((res) => {
        setPageDetails(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    CustomPages();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          Impel Store -
          {pageDetails[0]?.name && pageDetails[0]?.name
            ? pageDetails[0]?.name
            : ""}
        </title>
      </Helmet>
      <section className="wishlist">
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
            <div className="container">
              <div className="row">
                <div className="text-center">
                  <h4>{pageDetails[0]?.name}</h4>
                </div>
                <div className="col-md-12">
                  <div className="">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: pageDetails[0]?.content,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default CustomPageView;
