import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import ProductManagement from "./components/admin/ProductManagement";
import OrderManagement from "./components/admin/OrderManagement";
import Analytics from "./components/admin/Analytics";

// //Backend call
// async function getResponse(params) {
//   const apiUrl = `http://localhost:5000/`;
//   const response = await fetch(apiUrl);
//   console.log(response);
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // Default route
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true, // Default child route for /admin
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <ProductManagement />,
      },
      {
        path: "orders",
        element: <OrderManagement />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router}>
      <div className="bg-gray-100 min-h-screen min-w-screen flex items-center justify-center"></div>
    </RouterProvider>
  );
}

export default App;
