import { Router } from "express";
import { googleRedirect, googleCallback, getMe } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

const router = Router();

router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.get("/me", requireAuth, getMe);

export default router;
