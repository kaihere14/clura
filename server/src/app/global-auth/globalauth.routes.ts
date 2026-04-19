import { Router } from "express";
import {
  globalOpenIdRedirect,
  globalOpenIdCallback,
  globalRefreshTokens,
} from "./globalauth.controller";

const router = Router();

router.get("/google", globalOpenIdRedirect);
router.get("/callback", globalOpenIdCallback);
router.post("/refresh", globalRefreshTokens);

export default router;
