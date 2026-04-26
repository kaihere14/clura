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
} from "./globalauth.controller";

const router = Router();

router.get("/google", globalOpenIdRedirect);
router.get("/callback", globalOpenIdCallback);
router.get("/github", globalGithubRedirect);
router.get("/github/callback", globalGithubCallback);
router.post("/refresh", globalRefreshTokens);
router.post("/token", exchangeCode);
router.get("/check", checkLoginStatus);
router.post("/logout", globalLogout);
router.get("/logout", globalLogoutRedirect);

export default router;
