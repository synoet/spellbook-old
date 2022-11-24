import axios from "axios";
import jwt from "jsonwebtoken";
import { UserToken } from "./auth.schema";

export const createAuthToken = (user: UserToken) => {
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  return jwt.sign(
    { ...user, expires: expires },
    process.env.JWT_SECRET as string,
    { algorithm: "HS256" }
  );
};

export const getAuthToken = (req: any) => {
  return req.headers.token | req.cookies.token;
};

export const getGithubProfile = async (accessToken: string) => {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Encoding": "text/html; charset=UTF-8",
    },
  });

  return response.data;
};

export const handleGithubCallback = async (code: string) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }
  );

  return response.data.substring(
    response.data.indexOf("=") + 1,
    response.data.indexOf("&")
  );
};
