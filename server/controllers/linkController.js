const Url = require("../models/Url");

/**
 * @desc      Get all links created by current active user
 * @route     Get /api/links/my-links
 * @access    Private
 */

const getmyLinks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route!",
      });
    }

    const links = await Url.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    console.error("Error fetching user links:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { getmyLinks };
