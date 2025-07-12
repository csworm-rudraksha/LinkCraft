const express = require("express");
const { handelUserSignup, handelUserLogin, handleUserLogout, requireAuth } = require("../controllers/user");
const router = express.Router();

router.post("/signup", handelUserSignup);
router.post("/login", handelUserLogin);
router.get("/logout", handleUserLogout);

module.exports = router;
