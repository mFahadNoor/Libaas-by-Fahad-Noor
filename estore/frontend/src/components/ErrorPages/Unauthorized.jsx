import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Unauthorized() {
  const { user } = useAuth();
  console.log("HAHAHA:", user);
  const getRedirectPath = () => {
    switch (user?.role) {
      case "SELLER":
        return "/seller";
      case "USER":
        return "/customer";
      case "ADMIN":
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-black">403</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied :(
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to={getRedirectPath()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
