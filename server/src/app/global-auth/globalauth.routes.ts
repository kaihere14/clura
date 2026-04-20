import { Router } from "express";
import {
  globalOpenIdRedirect,
  globalOpenIdCallback,
  globalRefreshTokens,
  exchangeCode,
} from "./globalauth.controller";

const router = Router();

router.get("/google", globalOpenIdRedirect);
router.get("/callback", globalOpenIdCallback);
router.post("/refresh", globalRefreshTokens);
router.post("/token", exchangeCode);

export default router;
