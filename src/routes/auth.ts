import passport from "passport";
import { Router, Request, Response } from "express";

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

router.post(
  "/api/auth",
  passport.authenticate("local"),
  (_request: AuthRequest, response: Response) => {
    response.sendStatus(200);
  }
);

router.get("/api/auth/status", (request: AuthRequest, response: Response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request: AuthRequest, response: Response) => {
  if (!request.user) return response.sendStatus(401);
  (request as any).logout((err?: Error) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.get("/api/auth/discord", passport.authenticate("discord"));
router.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (_request: AuthRequest, response: Response) => {
    response.sendStatus(200);
  }
);

export default router;
