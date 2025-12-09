declare module "passport-discord" {
  import { Strategy as PassportStrategy } from "passport-strategy";

  interface Profile {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    email?: string;
    verified?: boolean;
  }

  interface StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOption,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user?: any) => void
      ) => void
    );
    name: string;
    authenticate(req: any, options?: any): void;
  }
}
