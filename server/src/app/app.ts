import expres from "express";
import type { Request, Response, Application } from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./auth/auth.routes";
import appRouter from "./application/app.routes";
import globalAuthRouter from "./global-auth/globalauth.routes";
import { getJwks } from "./well-known/jwks.controller";
import { getOpenIdConfiguration } from "./well-known/openid-configuration.controller";

export const getApp = (): Application => {
  const app = expres();
  app.use(cors());
  app.use(expres.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Server is up and running");
  });

  app.get("/.well-known/openid-configuration", getOpenIdConfiguration);
  app.get("/.well-known/jwks.json", getJwks);

  app.use("/v1/auth", authRouter);
  app.use("/v1/app", appRouter);
  app.use("/v1/global-auth", globalAuthRouter);

  return app;
};
