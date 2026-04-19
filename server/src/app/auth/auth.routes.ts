import { Router } from "express";
import { openIdRedirect, openIdCallback, getMe } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

const router = Router();

router.get("/google", openIdRedirect);
router.get("/google/callback", openIdCallback);
router.get("/me", requireAuth, getMe);

export default router;
