const express = require("express");
const ctrls = require("../../controllers/auth");
const router = express.Router();

router.post("/register", ctrls.register);

module.exports = router;