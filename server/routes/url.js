const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { shortenUrl } = require("../controllers/urlController");

// CSRF mitigation: this route uses the custom "x-auth-token" header for auth.
// Browsers cannot send custom headers cross-origin without a CORS preflight,
// making cookie-based CSRF attacks impossible. CORS origin restriction is
// enforced at the app level via the cors middleware in server.js.
router.post("/shorten", auth, shortenUrl);

module.exports = router;
