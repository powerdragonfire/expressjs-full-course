import { Router } from "express";
import usersRouter from "./users.js";
import productsRouter from "./products.js";
import authRouter from "./auth.js";
import { IUsersRepo } from "../data/usersRepo.js";

const createRoutes = (usersRepo: IUsersRepo) => {
  const router = Router();
  router.use(usersRouter(usersRepo));
  router.use(productsRouter);
  router.use(authRouter);
  return router;
};

export default createRoutes;
