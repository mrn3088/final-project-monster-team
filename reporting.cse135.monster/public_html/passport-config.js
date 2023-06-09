/**
 * source
 * https://www.youtube.com/watch?v=1aXZQcG2Y6I&t=3645s
 * https://www.youtube.com/watch?v=-RCnNyD0L-s
 */
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    let user = getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "Name or email incorrect." });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: "Password incorrect, please re-enter.",
        });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
