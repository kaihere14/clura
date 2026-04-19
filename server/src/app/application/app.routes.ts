import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import * as appController from "./app.controller";

const router = Router();

router.get("/validate/:appClientId", appController.validateApp);

router.use(requireAuth);

router.post("/", appController.createApp);
router.get("/", appController.listApps);
router.get("/:id", appController.getApp);
router.patch("/:id", appController.updateApp);
router.delete("/:id", appController.deleteApp);

export default router;
