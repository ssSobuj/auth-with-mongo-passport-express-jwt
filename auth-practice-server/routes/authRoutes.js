const router = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.post("/register", authController.register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login
);
router.get("/verify-email", authController.verifyEmail);

// Protected route example
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
