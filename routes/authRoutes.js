const router = require("express").Router();

const {
    login,
    refresh,
    logout,
} = require("../controllers/authController");


router.get("/login", login);

router.get("/refresh", refresh);

router.get("/logout", logout);

module.exports = router;