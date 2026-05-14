const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

/**
 * @desc    This function will be responsible for creating a new short URL.
 *          It will handle the business logic of validating the long URL,
 *          checking for its existence, generating a short code, and saving
 *          it to the database.
 * @route   POST /api/shorten
 * @access  Public
 */

const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a URL!" });
  }

  if (!validUrl.isUri(longUrl)) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid URL" });
  }

  try {
    let url = await Url.findOne({ longUrl: longUrl });

    if (url) {
      return res.status(200).json({ success: true, data: url });
    }

    const urlCode = nanoid(7);
    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

    const newUrlData = {
      longUrl,
      shortUrl,
      urlCode,
    };

    if (req.user) {
      newUrlData.user = req.user.id;
    }
    url = await Url.create(newUrlData);

    res.status(201).json({ success: true, data: url });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
};

const redirectToUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      url.clicks++;

      await url.save();

      return res.redirect(301, url.longUrl);
    } else {
      return res.status(404).json({ success: false, error: "No URL found" });
    }
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { shortenUrl, redirectToUrl };
