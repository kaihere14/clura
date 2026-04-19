import type { Response } from "express";
import type { AuthRequest } from "../auth/auth.middleware";
import * as appService from "./app.service";

export const createApp = async (req: AuthRequest, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ message: "name is required" });
    return;
  }
  const app = await appService.createApp(req.client!.clientId, name.trim());
  res.status(201).json(app);
};

export const listApps = async (req: AuthRequest, res: Response) => {
  const apps = await appService.getAppsByClient(req.client!.clientId);
  res.json(apps);
};

export const getApp = async (req: AuthRequest, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const app = await appService.getAppById(id, req.client!.clientId);
  if (!app) {
    res.status(404).json({ message: "App not found" });
    return;
  }
  res.json(app);
};

export const updateApp = async (req: AuthRequest, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ message: "name is required" });
    return;
  }
  const app = await appService.updateApp(id, req.client!.clientId, name.trim());
  if (!app) {
    res.status(404).json({ message: "App not found" });
    return;
  }
  res.json(app);
};

export const deleteApp = async (req: AuthRequest, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const app = await appService.deleteApp(id, req.client!.clientId);
  if (!app) {
    res.status(404).json({ message: "App not found" });
    return;
  }
  res.status(204).send();
};
