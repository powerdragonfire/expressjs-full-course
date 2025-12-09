import { User } from "../../mongoose/schemas/user.js";
import { IUsersRepo } from "../usersRepo";

export const getMongoUsersRepo = (): IUsersRepo => {
  return {
    createUser: async (data) => {
      const user = new User(data);
      const savedUser = await user.save();
      return {
        _id: savedUser._id.toString(),
        username: savedUser.username,
        password: savedUser.password,
        displayName: savedUser.displayName,
      };
    },
    findByUsername: async (username) => User.findOne({ username }),
    findById: async (id) => User.findById(id),
    verifyPassword: (user, comparePasswordFn, plain) => comparePasswordFn(plain, user.password),
  };
};
