import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import { User } from "../models/user";
import { JWT_SECRET } from "../util/secrets";
import { IUser } from "../interfaces/user.interface";


const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
  try {
    const user = await User.getUserByEmail(username.toLowerCase());
    if (!user) {
      return done(undefined, false, { message: `username ${username} not found.` });
    }
    const isMatch = User.comparePassword(user, password);
    if (isMatch) {
      return done(undefined, user);
    }
    return done(undefined, false, { message: "Invalid username or password." });
  } catch (err) {
    return done(err);
  }

}));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, async function (jwtToken, done) {
    try {
      const user = await User.getUserByEmail(jwtToken.username);
      if (user) {
        return done(undefined, user, jwtToken);
      } else {
        return done(undefined, false);
      }
    } catch (err) {
      return done(err);
    }
  }));


