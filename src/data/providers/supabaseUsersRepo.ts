import { IUsersRepo } from "../usersRepo.js";

export const getSupabaseUsersRepo = (): IUsersRepo => {
  const notImplemented = (): never => {
    throw new Error(
      "Supabase provider uses client-side auth. Wire supabase-js and JWT verification here."
    );
  };
  return {
    createUser: async () => notImplemented(),
    findByUsername: async () => notImplemented(),
    findById: async () => notImplemented(),
    verifyPassword: () => notImplemented(),
  };
};
