import passport from "passport";
import { Strategy } from "passport-local";
import { comparePassword } from "../utils/helpers.js";
import { IUsersRepo } from "../data/usersRepo.js";

export const configureLocalStrategy = (usersRepo: IUsersRepo): void => {
  if (!usersRepo) throw new Error("usersRepo is required for local strategy");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id || user._id);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.deserializeUser(async (id: string, done: any) => {
    try {
      const findUser = await usersRepo.findById(id);
      if (!findUser) throw new Error("User Not Found");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Strategy(async (username: string, password: string, done: any) => {
      try {
        const findUser = await usersRepo.findByUsername(username);
        if (!findUser) return done(null, false);
        const validPassword = usersRepo.verifyPassword(findUser, comparePassword, password);
        if (!validPassword) return done(null, false);
        done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    })
  );
};
