import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link, useLocation } from "react-router-dom";
import images from "../../assets/images/download.png";

const Popup = () => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(() => {
    const storedState = localStorage.getItem("showPopup");
    return storedState ? JSON.parse(storedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("showPopup", JSON.stringify(showPopup));
    localStorage.setItem("redirectPath", location.pathname);
  }, [showPopup]);

  useEffect(() => {
    if (window.location.reload && !showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(true);
      }, 600000);

      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  useEffect(() => {
    if (window.location.reload && showPopup) {
      setShowPopup(true);
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={showPopup}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-after",
          beforeClose: "overlay-before",
        }}
        className={{
          base: "content-base",
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}
      >
        <div className="position-relative">
          <img src={images} alt="image" />
          <Link to="login" className="model_banner_button">
            Login
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default Popup;

// 600000
