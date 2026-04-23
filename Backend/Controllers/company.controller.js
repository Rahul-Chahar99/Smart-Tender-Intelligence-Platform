import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Company } from "../Models/company.models.js";
import { Tender } from "../Models/tender.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Company.findById(userId);
    if (!user) {
      throw new ApiError(404, "Company not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await Company.findByIdAndUpdate(userId, {
      $set: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      500,
      error?.message ||
        "Something went wrong while generating refresh and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { companyName, email, password, turnover, certifications, location } =
    req.body;

  if (
    [companyName, email, password].some(
      (field) => !field || field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "companyName, email and password are required");
  }

  const existedUser = await Company.findOne({
    email: email.toLowerCase().trim(),
  });
  if (existedUser) {
    throw new ApiError(409, "Company with email already exists");
  }

  const user = await Company.create({
    companyName: companyName.trim(),
    email: email.toLowerCase().trim(),
    password,
    turnover: turnover ? Number(turnover) : undefined,
    certifications: certifications
      ? certifications
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [],
    location: location?.trim() || undefined,
  });

  const createdUser = await Company.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering company");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Company registered Successfully"));
});

//from here login function starts
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const logInUser = asyncHandler(async (req, res) => {
  // get user details from front end - req.body
  //check if we got username or email
  //find the user based on username or email
  //if user exist do the password check
  //generate accessToken and refreshToken
  //find user and remove password and refresh token
  //at the end send the refresh token and access token using cookies and rest of user details
  const { email, password } = req.body;

  const user = await Company.findOne({ email: email?.trim()?.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "Company does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await Company.findById(user._id).select(
    "-password -refreshToken",
  );

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction, // true in production, false locally
    sameSite: isProduction ? "none" : "lax", // "none" for cross-site (production), "lax" for same-site (local)
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // Set Access Token cookie
    .cookie("refreshToken", refreshToken, options) // Set Refresh Token cookie
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "Company logged in Successfully",
      ),
    );
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// user logout function
const logOutUser = asyncHandler(async (req, res) => {
  await Company.findByIdAndUpdate(
    req.company._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  // Clear cookies on the client side
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Company logged out"));
});

const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.company, "Company fetched successfully"));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  // Check for refresh token in cookies (preferred) or body
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  try {
    // Verify the token signature
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await Company.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    // Security Check: Ensure the token provided matches the one stored in the DB
    // If they don't match, the token might have been reused or the user logged out elsewhere
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }
    // 🔧 LOCAL vs PRODUCTION: Automatically adapts based on NODE_ENV
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    // Generate NEW tokens (Rotation)
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          201,
          { accessToken, newRefreshToken },
          "session restored",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const getTenders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "", source = "" } = req.query;
  const {id}= req.params

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  if (source) {
    query.source = source;
  }

  const companydetails = await Company.findOne({_id:id});
  if (!companydetails) {
    throw new ApiError(404, "Company not found");
  }

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

 
  query["requirements.turnover"] = { $lte: companydetails.turnover || 0 };

  const searchWords = [];

  // Check if the company actually has any certifications
  if (companydetails.certifications && companydetails.certifications.length > 0) {
    // Loop through each certification the company has (e.g., "ISO 9001")
    for (let i = 0; i < companydetails.certifications.length; i++) {
      const cert = companydetails.certifications[i];

      // Break the certification string apart by spaces: ["ISO", "9001"]
      const words = cert.split(" ");

      // Loop through those separated words
      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        // Ignore single letters so we don't accidentally match random things
        if (word.length > 1) {
          // Add it to our search array as a case-insensitive regular expression
          searchWords.push(new RegExp(word, "i"));
        }
      }
    }
  }
  
  // Tell MongoDB to find tenders that have ANY of these words
  query["requirements.certifications"] = { $in: searchWords };

  // Extract past project keywords to score experience
  const pastProjectCategories = (companydetails.pastProjects || [])
    .map(p => typeof p === 'string' ? p : p?.category || p?.title || "")
    .filter(Boolean);

  // 3. Execute the Aggregation Pipeline using $facet for pagination
  const pipeline = [
    { $match: query },
    {
      $addFields: {
        matchScore: {
          $add: [
            // 1. Turnover: 30 points if the company's turnover >= tender's requirement
            {
              $cond: [
                {
                  $lte: [
                    { $ifNull: [{ $arrayElemAt: ["$requirements.turnover", 0] }, 0] },
                    companydetails.turnover || 0
                  ]
                },
                30,
                0
              ]
            },
            // 2. Certifications: 10 points for every matching certification
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: [
                      { $ifNull: [{ $arrayElemAt: ["$requirements.certifications", 0] }, []] },
                      companydetails.certifications || []
                    ]
                  }
                },
                10
              ]
            },
            // 3. Past Experience: 30 points if tender category matches a past project category/title
            {
              $cond: [
                { $in: ["$category", pastProjectCategories] },
                30,
                0
              ]
            }
          ]
        }
      }
    },
    // 4. Sort the results so highest-scored tenders are at the top
    { $sort: { matchScore: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        tenders: [{ $skip: skip }, { $limit: parsedLimit }]
      }
    }
  ];

  const result = await Tender.aggregate(pipeline);
  
  const tenders = result[0]?.tenders || [];
  const total = result[0]?.metadata[0]?.total || 0;
  const totalPages = Math.ceil(total / parsedLimit) || 1;

  return res
    .status(200)
    .json(new ApiResponse(200, { tenders, total, totalPages }, "Tenders fetched successfully"));
});

//Goole login controller

export { registerUser, logInUser, logOutUser, getUser, refreshAcessToken ,getTenders};
