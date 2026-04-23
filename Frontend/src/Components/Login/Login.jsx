import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../ReusableComponents/input";
import Button from "../ReusableComponents/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginCompany, reset } from "../../Features/userSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const inputClass =
  "block w-full rounded-lg border border-[#2a2a2a] px-4 py-2 text-[#f5f5f0] placeholder-[#a3a3a3] focus:border-[#e8e8e0] focus:ring-1 focus:ring-[#e8e8e0] focus:outline-none sm:text-sm transition duration-200 bg-[#111111]";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(typeof message === "object" ? message?.message : message || "Login failed");
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success(typeof message === "object" ? message?.message : message || "Login successful");
      dispatch(reset());
      navigate("/");
    }
  }, [isError, isSuccess, message, dispatch, navigate]);

  const onSubmit = (data) => {
    dispatch(loginCompany({ email: data.email, password: data.password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-[#2a2a2a]">

        <div className="text-center mb-8">
          <span className="inline-block mb-3 px-3 py-1 rounded-full border border-[#2a2a2a] text-xs font-semibold tracking-widest uppercase text-[#a3a3a3]">
            Company Portal
          </span>
          <h2 className="text-3xl font-extrabold text-[#f5f5f0] tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#a3a3a3]">Sign in to your company account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          <div>
            <Input
              label="Company Email"
              type="email"
              placeholder="contact@company.com"
              className={inputClass}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              className={inputClass}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-[#f5f5f0] px-4 py-3 text-sm font-bold text-[#0a0a0a] hover:bg-white focus:outline-none transition-all duration-200 hover:-translate-y-0.5"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="border-t border-[#2a2a2a] pt-4 text-center">
            <p className="text-sm text-[#a3a3a3]">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[#f5f5f0] font-semibold hover:text-white underline underline-offset-2 transition"
              >
                Register your company
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
