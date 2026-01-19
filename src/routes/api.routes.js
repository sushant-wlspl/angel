const express = require("express");
const router = express.Router();

const { testApi } = require("../controllers/test.controller");
const { testAngelLogin } = require("../controllers/angel.controller");
const { getLTP } = require("../controllers/ltp.controller");


router.get("/test", testApi);
router.get("/angel-login", testAngelLogin);
router.get("/ltp", getLTP);

module.exports = router;