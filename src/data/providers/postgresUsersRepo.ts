import { IUsersRepo } from "../usersRepo.js";

export const getPostgresUsersRepo = (): IUsersRepo => {
  const notImplemented = (): never => {
    throw new Error("Postgres provider not implemented yet. Add PG client, schema, and queries.");
  };
  return {
    createUser: async () => notImplemented(),
    findByUsername: async () => notImplemented(),
    findById: async () => notImplemented(),
    verifyPassword: () => notImplemented(),
  };
};
