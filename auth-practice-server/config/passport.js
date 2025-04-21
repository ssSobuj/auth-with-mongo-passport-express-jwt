const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

// Local strategy for email/password
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// JWT Strategy (FIXED)
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    // <-- Changed to JwtStrategy
    try {
      const user = await User.findById(jwtPayload.sub);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
