import expres from "express";
import type { Request, Response, Application } from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./auth/auth.routes";

export const getApp = (): Application => {
  const app = expres();
  app.use(cors());
  app.use(expres.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Server is up and running");
  });

  app.use("/v1/auth", authRouter);

  return app;
};
