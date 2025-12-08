const router = require("express").Router();
const {
  handleGoogleToken,
  handleGoogleRegister,
  handleLocalRegister,
  handleLocalLogin,
} = require("../controllers/authController");

router.post("/google/token", handleGoogleToken);
router.post("/google/register", handleGoogleRegister);
router.post("/register", handleLocalRegister);
router.post("/login", handleLocalLogin);

module.exports = router;
