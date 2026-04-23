import React, { useEffect } from "react";
import Input from "./ReusableComponents/input";
import Button from "./ReusableComponents/Button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerCompany, reset } from "../Features/userSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Something went wrong");
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success(message || "Company registered successfully");
      dispatch(reset());
      navigate("/login");
    }
  }, [isError, isSuccess, message, dispatch, navigate]);

  const onSubmit = (data) => {
    dispatch(registerCompany({
      companyName: data.companyName,
      email: data.email,
      password: data.password,
      turnover: data.turnover || undefined,
      certifications: data.certifications || undefined,
      location: data.location || undefined,
    }));
  };

  const inputClass =
    "block w-full rounded-lg border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#f5f5f0] placeholder-[#a3a3a3] focus:border-[#e8e8e0] focus:ring-1 focus:ring-[#e8e8e0] focus:outline-none transition duration-200 bg-[#111111]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-lg bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <span className="inline-block mb-3 px-3 py-1 rounded-full border border-[#2a2a2a] text-xs font-semibold tracking-widest uppercase text-[#a3a3a3]">
            Company Registration
          </span>
          <h2 className="text-2xl font-extrabold text-[#f5f5f0] tracking-tight">Register Your Company</h2>
          <p className="text-sm text-[#a3a3a3] mt-1">Start discovering and winning government tenders</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <Input
              label="Company Name *"
              placeholder="e.g. Acme Pvt. Ltd."
              className={inputClass}
              {...register("companyName", { required: "Company name is required" })}
            />
            {errors.companyName && <p className="mt-1 text-xs text-red-400">{errors.companyName.message}</p>}
          </div>

          <div>
            <Input
              label="Company Email *"
              type="email"
              placeholder="contact@company.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                validate: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Enter a valid email",
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              label="Password *"
              type="password"
              placeholder="Create a strong password"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="border-t border-[#2a2a2a] pt-4">
            <p className="text-xs text-[#a3a3a3] mb-4 uppercase tracking-widest font-semibold">
              Company Profile (Optional)
            </p>

            <div className="mb-4">
              <Input
                label="Annual Turnover (₹)"
                type="number"
                placeholder="e.g. 5000000"
                className={inputClass}
                {...register("turnover", { min: { value: 0, message: "Cannot be negative" } })}
              />
              {errors.turnover && <p className="mt-1 text-xs text-red-400">{errors.turnover.message}</p>}
            </div>

            <div className="mb-4">
              <Input
                label="Certifications"
                placeholder="e.g. ISO 9001, MSME, NSIC (comma separated)"
                className={inputClass}
                {...register("certifications")}
              />
              <p className="mt-1 text-xs text-[#a3a3a3]">Separate multiple certifications with commas</p>
            </div>

            <div>
              <Input
                label="Location"
                placeholder="e.g. New Delhi, India"
                className={inputClass}
                {...register("location")}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-[#f5f5f0] px-4 py-3 text-sm font-bold text-[#0a0a0a] hover:bg-white focus:outline-none transition-all duration-200 hover:-translate-y-0.5 mt-2"
          >
            {isLoading ? "Registering..." : "Register Company →"}
          </Button>

          <p className="text-center text-sm text-[#a3a3a3]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#f5f5f0] font-semibold hover:text-white underline underline-offset-2 transition"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
