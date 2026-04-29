import { Router } from "express";
import {
  globalOpenIdRedirect,
  globalOpenIdCallback,
  globalGithubRedirect,
  globalGithubCallback,
  globalRefreshTokens,
  globalLogout,
  globalLogoutRedirect,
  checkLoginStatus,
  exchangeCode,
  globalRegisterWithPassword,
  globalLoginWithPassword,
} from "./globalauth.controller";

const router = Router();

router.get("/google", globalOpenIdRedirect);
router.get("/callback", globalOpenIdCallback);
router.get("/github", globalGithubRedirect);
router.get("/github/callback", globalGithubCallback);
router.post("/register", globalRegisterWithPassword);
router.post("/login", globalLoginWithPassword);
router.post("/refresh", globalRefreshTokens);
router.post("/token", exchangeCode);
router.post("/check", checkLoginStatus);
router.all("/check", (_req, res) => {
  res.set("Allow", "POST").status(405).json({ message: "Method not allowed" });
});
router.post("/logout", globalLogout);
router.get("/logout", globalLogoutRedirect);

export default router;
