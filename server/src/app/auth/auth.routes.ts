import { Router } from "express";
import * as auth from "./auth.controller";
import { requireAuth } from "./auth.middleware";

const router = Router();

router.get("/google", auth.googleIdRedirect);
router.get("/google/callback", auth.googleIdCallback);

router.get("/github", auth.githubIdRedirect);
router.get("/github/callback", auth.githubIdCallback);

router.get("/me", requireAuth, auth.getMe);

export default router;
