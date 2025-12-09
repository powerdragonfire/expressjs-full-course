import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockUsers } from "../utils/constants";
import { createUserValidationSchema } from "../utils/validationSchemas";
import { resolveIndexByUserId } from "../utils/middlewares";
import { createUserHandler, getUserByIdHandler } from "../handlers/users";
import { IUsersRepo } from "../data/usersRepo.js";

const createUsersRouter = (usersRepo: IUsersRepo) => {
  const router = Router();

  router.get(
    "/api/users",
    query("filter")
      .isString()
      .notEmpty()
      .withMessage("Must not be empty")
      .isLength({ min: 3, max: 10 })
      .withMessage("Must be at least 3-10 characters"),
    (request: any, response) => {
      request.sessionStore.get(request.session.id, (_err: Error | null) => {
        // Session store check
      });
      const {
        query: { filter, value },
      }: any = request;
      if (filter && value)
        return response.send(
          mockUsers.filter((user: any) => user[filter as string]?.includes(value))
        );
      return response.send(mockUsers);
    }
  );

  router.get("/api/users/:id", getUserByIdHandler(usersRepo));

  router.post("/api/users", checkSchema(createUserValidationSchema), createUserHandler(usersRepo));

  router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request as any;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
  });

  router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request as any;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
  });

  router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request as any;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
  });

  return router;
};

export default createUsersRouter;
