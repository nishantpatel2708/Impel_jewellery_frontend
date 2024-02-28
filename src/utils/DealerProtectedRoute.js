import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DealerProtectedRoute = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userToken = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    if (userType === 1 && location.pathname === "/login") {
      navigate("/");
    }
  }, [userType, location.pathname]);

  const checkDealer = () => {
    if (!userToken) {
      setIsLoggedIn(false);
      return navigate("/login");
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkDealer();
  }, [isLoggedIn]);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default DealerProtectedRoute;
