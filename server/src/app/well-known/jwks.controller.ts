import type { Request, Response } from "express";
import crypto from "node:crypto";

const { JWT_PUBLIC_KEY, JWT_KEY_ID } = process.env;

let cachedJwks: object | null = null;

const buildJwks = () => {
  if (cachedJwks) return cachedJwks;

  const pubKey = crypto.createPublicKey(JWT_PUBLIC_KEY!.replace(/\\n/g, "\n"));
  const { n, e } = pubKey.export({ format: "jwk" }) as { n: string; e: string };

  cachedJwks = {
    keys: [{ kty: "RSA", use: "sig", alg: "RS256", kid: JWT_KEY_ID ?? "clura-1", n, e }],
  };
  return cachedJwks;
};

export const getJwks = (_req: Request, res: Response) => {
  res.json(buildJwks());
};
