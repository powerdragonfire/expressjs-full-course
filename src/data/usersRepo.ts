export interface IUser {
  _id?: string;
  id?: string;
  username: string;
  displayName?: string;
  password: string;
}

export interface IUsersRepo {
  createUser(data: Partial<IUser>): Promise<IUser>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  verifyPassword(
    user: IUser,
    comparePasswordFn: (plain: string, hashed: string) => boolean,
    plain: string
  ): boolean;
}

import { getMongoUsersRepo } from "./providers/mongoUsersRepo.js";
import { getPostgresUsersRepo } from "./providers/postgresUsersRepo.js";
import { getSupabaseUsersRepo } from "./providers/supabaseUsersRepo.js";

export const buildUsersRepo = (provider: string = "mongodb"): IUsersRepo => {
  if (provider === "postgres") return getPostgresUsersRepo();
  if (provider === "supabase") return getSupabaseUsersRepo();
  return getMongoUsersRepo();
};
