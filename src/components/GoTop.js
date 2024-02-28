import React, { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa";

const GoTop = () => {
  const [backButton, setBackButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setBackButton(true);
      } else {
        setBackButton(false);
      }
    });
  }, []);

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {backButton && (
        <button
          className="btn"
          style={{
            position: "fixed",
            background: "#db9662",
            bottom: "50px",
            right: "50px",
            height: "50px",
            width: "50px",
            fontSize: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9",
          }}
          onClick={scrollup}
        >
          <FaAngleUp />
        </button>
      )}
    </div>
  );
};

export default GoTop;
