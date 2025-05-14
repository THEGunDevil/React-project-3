import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./Components/Layout";
import { UserProvider } from "./Contexts/UserContext";
import SignIn from "./Components/Sign In/SignIn";
import Register from "./Components/Register/Register";
import Contact from "./Components/Contact/Contact";
import AddProduct from "./Components/AddProduct";
import { ToastContainer } from "react-toastify";
import Fallback from "./Components/Loader/Fallback";

// Lazy-loaded components
const Home = lazy(() => import("./Components/Home/Home"));
const Profile = lazy(() => import("./Components/Profile/Profile"));
const Product = lazy(() => import("./Components/Product"));
const Setting = lazy(() => import("./Components/Setting/Setting"));

const NotFound = () => (
  <div className="flex py-10 justify-center items-center">
    <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/product/:productid", element: <Product /> },
      { path: "/setting", element: <Setting /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/register", element: <Register /> },
      { path: "/contact", element: <Contact /> },
      { path: "/addproduct", element: <AddProduct /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <Suspense fallback={<Fallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer />
    </UserProvider>
  </StrictMode>
);
