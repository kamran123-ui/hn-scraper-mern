const axios  = require('axios');
const cheerio = require('cheerio');
const Story  = require('../models/Story');

const HN_URL    = 'https://news.ycombinator.com';
const TOP_COUNT = 10;

/**
 * Scrapes the top N stories from Hacker News and upserts them in MongoDB.
 * @returns {{ success: boolean, count: number, stories: object[] }}
 */
const scrapeHackerNews = async () => {
  console.log('🔍 Fetching Hacker News...');

  const { data: html } = await axios.get(HN_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; HNScraper/1.0; +https://github.com)',
    },
    timeout: 15_000,
  });

  const $       = cheerio.load(html);
  const stories = [];

  // Hacker News story rows have class "athing"
  const rows = $('.athing').toArray().slice(0, TOP_COUNT);

  for (const el of rows) {
    const $el   = $(el);
    const hnId  = $el.attr('id') || '';

    // Title & external URL
    const $titleLink = $el.find('.titleline > a').first();
    const title      = $titleLink.text().trim();
    let   url        = $titleLink.attr('href') || '';

    // Internal HN links start with "item?id=" – resolve to full URL
    if (url.startsWith('item?')) {
      url = `${HN_URL}/${url}`;
    }

    // Sub-text row (points, author, posted-at) is the immediately following <tr>
    const $sub    = $el.next('tr').find('.subtext, .subline');
    const points  = parseInt($sub.find('.score').text()) || 0;
    const author  = $sub.find('.hnuser').text().trim()   || 'unknown';
    const postedAt = $sub.find('.age').attr('title')
                  || $sub.find('.age').text().trim()
                  || '';

    if (title) {
      stories.push({ hnId, title, url, points, author, postedAt });
    }
  }

  // Upsert all stories (avoid duplicates by hnId)
  let savedCount = 0;
  for (const story of stories) {
    await Story.findOneAndUpdate({ hnId: story.hnId }, story, {
      upsert: true,
      new:    true,
      setDefaultsOnInsert: true,
    });
    savedCount++;
  }

  console.log(`✅ Saved ${savedCount} stories to MongoDB`);
  return { success: true, count: savedCount, stories };
};

module.exports = { scrapeHackerNews };
