import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    turnover: {
      type: Number,
    },
    certifications: [
      {
        type: String,
      },
    ],
    pastProjects: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    location: {
      type: String,
    },
    appliedTenders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tender",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

companySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

companySchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
companySchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
companySchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};
export const Company = mongoose.model("Company", companySchema);
