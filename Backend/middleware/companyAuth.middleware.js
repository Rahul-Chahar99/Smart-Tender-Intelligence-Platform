import jwt from "jsonwebtoken";
import { Company } from "../Models/company.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyCompanyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const company = await Company.findById(decoded._id).select(
    "-password -refreshToken",
  );
  if (!company) throw new ApiError(401, "Invalid access token");

  req.company = company;
  next();
});
