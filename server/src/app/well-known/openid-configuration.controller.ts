import type { Request, Response } from "express";

const { JWT_ISSUER } = process.env;

export const getOpenIdConfiguration = (_req: Request, res: Response) => {
  const issuer = JWT_ISSUER ?? "http://localhost:8000";

  res.json({
    issuer,
    authorization_endpoint: `${issuer}/v1/global-auth/google`,
    token_endpoint: `${issuer}/v1/global-auth/token`,
    token_refresh_endpoint: `${issuer}/v1/global-auth/refresh`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "email", "profile"],
    token_endpoint_auth_methods_supported: ["client_secret_post"],
    claims_supported: [
      "sub",
      "email",
      "name",
      "picture",
      "app_client_id",
      "sid",
      "iss",
      "iat",
      "exp",
    ],
  });
};
