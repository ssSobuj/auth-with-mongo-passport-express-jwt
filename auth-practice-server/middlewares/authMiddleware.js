exports.requireAuth = passport.authenticate("jwt", { session: false });
