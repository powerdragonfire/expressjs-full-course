import { Pool } from "pg";
import { IUsersRepo, IUser } from "../usersRepo.js";

let pool: Pool | null = null;

export const initPostgresPool = (connectionString: string): Pool => {
  pool = new Pool({ connectionString });
  return pool;
};

export const getPostgresUsersRepo = (): IUsersRepo => {
  if (!pool) {
    throw new Error("PostgreSQL pool not initialized. Call initPostgresPool first.");
  }

  return {
    createUser: async (data) => {
      const result = await pool!.query(
        "INSERT INTO users (username, password, display_name) VALUES ($1, $2, $3) RETURNING id, username, password, display_name",
        [data.username, data.password, data.displayName || null]
      );
      const row = result.rows[0];
      return {
        _id: row.id.toString(),
        username: row.username,
        password: row.password,
        displayName: row.display_name,
      };
    },

    findByUsername: async (username) => {
      const result = await pool!.query(
        "SELECT id, username, password, display_name FROM users WHERE username = $1",
        [username]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        _id: row.id.toString(),
        username: row.username,
        password: row.password,
        displayName: row.display_name,
      };
    },

    findById: async (id) => {
      const result = await pool!.query(
        "SELECT id, username, password, display_name FROM users WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        _id: row.id.toString(),
        username: row.username,
        password: row.password,
        displayName: row.display_name,
      };
    },

    verifyPassword: (user, comparePasswordFn, plain) => comparePasswordFn(plain, user.password),
  };
};
