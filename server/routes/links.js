const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { getmyLinks } = require("../controllers/linkController");

router.get("/my-links", auth, getmyLinks);

module.exports = router;
