import { Router } from "express";
import {
  registerUser,
  logInUser,
  logOutUser,
  getUser,
  refreshAcessToken,
} from "../Controllers/company.controller.js";
import { verifyCompanyJWT } from "../middleware/companyAuth.middleware.js";
import { getTenders } from "../Controllers/company.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", verifyCompanyJWT, logOutUser);
router.get("/current-company", verifyCompanyJWT, getUser);
router.post("/refresh-token", refreshAcessToken);
router.route('/tenders/:id').get(verifyCompanyJWT,getTenders)

export default router;
