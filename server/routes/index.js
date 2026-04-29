const express = require("express");
const router = express.Router();

/**
 * @route   GET /:code
 * @desc    Redirect to the long/original URL
 * @access  Public
 */

const { redirectToUrl } = require("../controllers/urlController");
router.get("/:code", redirectToUrl);

module.exports = router;
