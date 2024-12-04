import { React } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import ProductManagement from "./components/admin/ProductManagement";
import OrderManagement from "./components/admin/OrderManagement";
import Analytics from "./components/admin/Analytics";
import NotFound from "./components/ErrorPages/NotFound";
import Unauthorized from "./components/ErrorPages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import Temp from "./Temp";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
// //Backend call
// async function getResponse(params) {
//   const apiUrl = `http://localhost:5000/`;
//   const response = await fetch(apiUrl);
//   console.log(response);
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RedirectIfLoggedIn>
          <Login />
        </RedirectIfLoggedIn>
      </AuthProvider>
    ),
  },
  {
    path: "/login",

    element: (
      <AuthProvider>
        <RedirectIfLoggedIn>
          <Login />
        </RedirectIfLoggedIn>
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <RedirectIfLoggedIn>
          <Register />
        </RedirectIfLoggedIn>
      </AuthProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <PrivateRoute allowedRoles={["ADMIN"]}>
          <AdminLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <ProductManagement /> },
      { path: "orders", element: <OrderManagement /> },
      { path: "analytics", element: <Analytics /> },
    ],
  },
  {
    path: "/seller",
    element: (
      <AuthProvider>
        <PrivateRoute allowedRoles={["SELLER"]}>
          <Temp />
        </PrivateRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/customer",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <Temp />
        </PrivateRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/temp",
    element: <Temp />,
  },
  {
    path: "/unauthorized",
    element: (
      <AuthProvider>
        <Unauthorized />
      </AuthProvider>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router}>
      <div className="bg-gray-100 min-h-screen min-w-screen flex items-center justify-center"></div>
    </RouterProvider>
    // TODO: on log out, localStorage.removeItem('user');
  );
}

export default App;
