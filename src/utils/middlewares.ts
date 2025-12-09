import { Request, Response, NextFunction } from "express";
import { mockUsers } from "./constants.js";

export const resolveIndexByUserId = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    response.sendStatus(400);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findUserIndex = mockUsers.findIndex((user: any) => user.id === parsedId);
  if (findUserIndex === -1) {
    response.sendStatus(404);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (request as any).findUserIndex = findUserIndex;
  next();
};
