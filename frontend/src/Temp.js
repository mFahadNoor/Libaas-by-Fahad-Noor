import React from "react";

const Temp = () => {
  const handleLogout = () => {
    // Remove the 'user' item from localStorage
    localStorage.removeItem("user");
    // Optionally, you can redirect to a different page after logout, e.g., home page
    window.location.href = "/"; // Redirect to home page (you can change the route as needed)
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Temp;
