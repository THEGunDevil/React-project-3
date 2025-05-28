import { StrictMode, Suspense, lazy, useContext } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./Components/Layout";
import { UserContext, UserProvider } from "./Contexts/UserContext";
import SignIn from "./Components/Sign In/SignIn";
import Register from "./Components/Register/Register";
import Contact from "./Components/Contact/Contact";
import { ToastContainer } from "react-toastify";
import Fallback from "./Components/Loader/Fallback";
import { CartProvider } from "./Contexts/CartContext";
import ProtectedRoute from "./Components/ProtectedRoute";
// Lazy-loaded components
const Home = lazy(() => import("./Components/Home/Home"));
const Profile = lazy(() => import("./Components/Profile/Profile"));
const Product = lazy(() => import("./Components/Product"));
const Setting = lazy(() => import("./Components/Setting/Setting"));
const Cart = lazy(() => import("./Components/Cart"));
const Dashboard = lazy(()=>import("./Components/Dashboard/Dashboard"))

const NotFound = () => (
  <div className="flex py-10 justify-center items-center mt-14 md:mt-20">
    <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
  </div>
);

function App() {
  const { user } = useContext(UserContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> }, // Public route
        {
          path: "/profile",
          element: <ProtectedRoute element={<Profile />} />, // Protected for authenticated users
        },
        {
          path: "/product/:productid",
          element: <ProtectedRoute element={<Product />} />, // Protected for authenticated users
        },
        {
          path: "/setting",
          element: <ProtectedRoute element={<Setting />} />, // Protected for authenticated users
        },
        ...(user
          ? []
          : [
              { path: "/signin", element: <SignIn /> }, // Public if not logged in
              { path: "/register", element: <Register /> }, // Public if not logged in
            ]),
        { path: "/contact", element: <Contact /> }, // Public route
        {
          path: "/cart",
          element: <ProtectedRoute element={<Cart />} />, // Protected for authenticated users
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute element={<Dashboard />} requireAdmin={true} />
          ), // Protected for admin only
        },
        { path: "*", element: <NotFound /> }, // Catch-all for 404
      ],
    },
  ]);

  return (
    <Suspense fallback={<Fallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <App />
        <ToastContainer />
      </CartProvider>
    </UserProvider>
  </StrictMode>
);