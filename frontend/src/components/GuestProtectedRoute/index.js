import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";


const GuestProtectedRoute = () => {
  let isVerified=false;
  if (Cookies.get("authenticated")){
    isVerified = true
  }
  if (localStorage.getItem("guest_id")){
    isVerified = true
  }
  return isVerified ? <Outlet /> : <Navigate to="/login" />;
};

export default GuestProtectedRoute;
