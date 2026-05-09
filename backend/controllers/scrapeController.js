const { scrapeHackerNews } = require('../scraper/scraper');

// ─── POST /api/scrape ─────────────────────────────────────────────────────────
const triggerScrape = async (req, res, next) => {
  try {
    const result = await scrapeHackerNews();
    res.json({
      message: `Successfully scraped ${result.count} stories from Hacker News.`,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { triggerScrape };
