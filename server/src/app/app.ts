import expres from "express";
import type { Request, Response, Application } from "express";
import cors from "cors";
import "dotenv/config";

export const getApp = (): Application => {
  const app = expres();
  app.use(cors());

  app.get("/", (req: Request, res: Response) => {
    res.send("Server is up and running");
  });

  return app;
};
