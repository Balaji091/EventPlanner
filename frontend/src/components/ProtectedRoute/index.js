import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("http://localhost:5001/auth/verify", {
          method: "GET",
          credentials: "include", // Send cookies with request
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setIsVerified(false);
      }
    };

    verifyUser();
  }, []);

  if (isVerified === null) return <p>Loading...</p>; // Show loading while verifying
  return isVerified ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
