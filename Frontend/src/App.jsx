import { Suspense, useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Features/userSlice";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import axios from "./Components/axios.js";
import toast, { Toaster } from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import { io } from "socket.io-client";

export let socket;

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Socket setup
  useEffect(() => {
    if (userInfo) {
      socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", {
        withCredentials: true,
      });
      socket.emit("setup", userInfo);
      if (userInfo.role === "admin") {
        socket.on("new_booking_notification", (data) => {
          toast.success(data.message || "A new booking was successfully created!");
        });
      }
      return () => socket.disconnect();
    }
  }, [userInfo]);

  useEffect(() => {
    // Axios interceptor — refresh token on 401
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest._skipAuthRefresh &&
          originalRequest.url !== "/api/v1/company/refresh-token"
        ) {
          originalRequest._retry = true;
          try {
            await axios.post("/api/v1/company/refresh-token");
            return axios(originalRequest);
          } catch {
            dispatch(logout());
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );

    // Session check
    (async () => {
      try {
        const { data } = await axios.get("/api/v1/company/current-company");
        dispatch(login(data.data)); // data.data is the company object
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout());
        } else if (error.response?.status === 429) {
          toast.error("Too many requests. Please refresh the page in a minute.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => axios.interceptors.response.eject(interceptorId);
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!loading ? (
        <div className="min-h-screen flex flex-wrap content-between bg-[#0a0a0a]">
          <div className="w-full block">
            <Header />
            <main>
              <Suspense
                fallback={
                  <div className="flex justify-center items-center py-20 w-full">
                    <ScaleLoader color="#e8e8e0" size={50} />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-full bg-[#0a0a0a]">
          <ScaleLoader color="#e8e8e0" size={80} />
        </div>
      )}
    </>
  );
}

export default App;
