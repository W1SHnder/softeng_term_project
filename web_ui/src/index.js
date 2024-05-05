import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Home from "./components/Home";
import Admin from "./components/Admin"
import Login from "./components/Login"
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: "Admin/",
    element: <Admin />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgotPassword',
    element: <ForgotPassword />,
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);