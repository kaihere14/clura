import type { Request, Response } from "express";
import type { AuthRequest } from "../auth/auth.middleware";
import * as appService from "./app.service";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const parseId = (raw: string) => (UUID_RE.test(raw) ? raw : null);

export const validateApp = async (req: Request, res: Response) => {
  const { appClientId } = req.params;
  const valid = await appService.validateAppClientId(appClientId as string);
  res.json({ valid });
};

export const createApp = async (req: AuthRequest, res: Response) => {
  const { name, redirectUri } = req.body as { name?: string; redirectUri?: string };
  if (!name?.trim()) {
    res.status(400).json({ message: "name is required" });
    return;
  }
  if (!redirectUri?.trim()) {
    res.status(400).json({ message: "redirectUri is required" });
    return;
  }
  const app = await appService.createApp(req.client!.clientId, name.trim(), redirectUri.trim());
  res.status(201).json(app);
};

export const listApps = async (req: AuthRequest, res: Response) => {
  const apps = await appService.getAppsByClient(req.client!.clientId);
  res.json(apps);
};

export const getApp = async (req: AuthRequest, res: Response) => {
  const id = parseId(String(req.params.id));
  if (!id) {
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
  const id = parseId(String(req.params.id));
  if (!id) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const { name, redirectUri } = req.body as { name?: string; redirectUri?: string };
  if (!name?.trim()) {
    res.status(400).json({ message: "name is required" });
    return;
  }
  const app = await appService.updateApp(
    id,
    req.client!.clientId,
    name.trim(),
    redirectUri?.trim(),
  );
  if (!app) {
    res.status(404).json({ message: "App not found" });
    return;
  }
  res.json(app);
};

export const deleteApp = async (req: AuthRequest, res: Response) => {
  const id = parseId(String(req.params.id));
  if (!id) {
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
