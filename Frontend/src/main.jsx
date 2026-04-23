import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import store from "./Features/store";
import { Provider } from "react-redux";
import App from "./App.jsx";
import AuthLayout from "./Components/AuthLayout.jsx";

const Home = lazy(() => import("./Components/Home/Home.jsx"));
const TenderList = lazy(() => import("./Components/Tenderlist.jsx"));

const Login = lazy(() => import("./Components/Login/Login.jsx"));
const Signup = lazy(() => import("./Components/Signup.jsx"));

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/my-tenders"
          element={
            <AuthLayout authentication>
              <TenderList />
            </AuthLayout>
          }
        />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
