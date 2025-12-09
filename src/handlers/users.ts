import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { hashPassword } from "../utils/helpers.js";
import { IUsersRepo } from "../data/usersRepo.js";

export const getUserByIdHandler =
  (usersRepo: IUsersRepo) => async (request: Request, response: Response) => {
    try {
      const findUser = await usersRepo.findById(request.params.id);
      if (!findUser) return response.sendStatus(404);
      return response.send(findUser);
    } catch (err) {
      return response.sendStatus(400);
    }
  };

export const createUserHandler =
  (usersRepo: IUsersRepo) => async (request: Request, response: Response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());
    const data = matchedData(request);
    (data as any).password = hashPassword((data as any).password);
    try {
      const savedUser = await usersRepo.createUser(data);
      return response.status(201).send(savedUser);
    } catch (err) {
      return response.sendStatus(400);
    }
  };
