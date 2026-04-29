const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { shortenUrl } = require("../controllers/urlController");
router.post("/shorten", auth, shortenUrl);

module.exports = router;
