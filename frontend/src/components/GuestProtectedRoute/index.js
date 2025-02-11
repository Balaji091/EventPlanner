import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";


const GuestProtectedRoute = () => {
  let isVerified=false;
  if (localStorage.getItem("guest_id" || Cookies.get("authenticated"))){
    isVerified = true
  }
  return isVerified ? <Outlet /> : <Navigate to="/login" />;
};

export default GuestProtectedRoute;
