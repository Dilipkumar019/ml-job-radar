// pages/api/cron/scrape.js
// This is called by Vercel Cron every 30 minutes

import { scrapeAllCompanies } from '../../../lib/scraper';

export default async function handler(req, res) {
  // Verify this is called by Vercel Cron or authorized source
  const authHeader = req.headers.authorization;
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting scrape job at', new Date().toISOString());
    const jobs = await scrapeAllCompanies();

    // Store in Vercel KV
    const { kv } = await import('@vercel/kv');
    await kv.set('jobs:all', JSON.stringify(jobs));
    await kv.set('jobs:lastUpdated', new Date().toISOString());
    await kv.set('jobs:count', jobs.length);

    // Also store indexed by company for faster filtering
    const byCompany = {};
    jobs.forEach(job => {
      if (!byCompany[job.company]) byCompany[job.company] = [];
      byCompany[job.company].push(job);
    });
    for (const [company, companyJobs] of Object.entries(byCompany)) {
      await kv.set(`jobs:company:${company}`, JSON.stringify(companyJobs));
    }

    console.log(`Scraped ${jobs.length} jobs successfully`);
    return res.status(200).json({
      success: true,
      jobsFound: jobs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scrape job failed:', error);
    return res.status(500).json({ error: error.message });
  }
}
