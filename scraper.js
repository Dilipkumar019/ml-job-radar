// lib/scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { COMPANIES, JOB_KEYWORDS, EXPERIENCE_FILTERS } from './companies';

const USER_AGENT = 'Mozilla/5.0 (compatible; JobTracker/1.0)';
const TIMEOUT = 15000;

// ─── Helpers ────────────────────────────────────────────────────────────────

function isRelevantJob(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();
  const hasKeyword = JOB_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  return hasKeyword;
}

function isEntryLevel(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  // Exclude senior/staff/principal
  const seniorTerms = ['senior', 'sr.', 'staff', 'principal', 'director', 'head of', 'lead', 'manager', 'vp ', 'vice president'];
  if (seniorTerms.some(t => text.includes(t))) return false;
  return true;
}

function normalizeJob({ title, company, location, url, postedAt, jobId, description, remote }) {
  return {
    id: jobId || `${company}-${Buffer.from(title + url).toString('base64').slice(0, 12)}`,
    title,
    company,
    location: location || 'Not specified',
    remote: remote || location?.toLowerCase().includes('remote') || false,
    url,
    postedAt: postedAt || new Date().toISOString(),
    description: description?.slice(0, 500) || '',
    scrapedAt: new Date().toISOString(),
  };
}

// ─── Greenhouse ATS ──────────────────────────────────────────────────────────

async function scrapeGreenhouse(company) {
  try {
    const res = await axios.get(
      `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=true`,
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT } }
    );
    const jobs = res.data?.jobs || [];
    return jobs
      .filter(j => isRelevantJob(j.title, j.content) && isEntryLevel(j.title, j.content))
      .map(j => normalizeJob({
        title: j.title,
        company: company.name,
        location: j.location?.name,
        url: j.absolute_url,
        jobId: String(j.id),
        description: cheerio.load(j.content || '')?.text()?.slice(0, 500),
        postedAt: j.updated_at,
      }));
  } catch {
    return [];
  }
}

// ─── Lever ATS ───────────────────────────────────────────────────────────────

async function scrapeLever(company) {
  try {
    const res = await axios.get(
      `https://api.lever.co/v0/postings/${company.slug}?mode=json`,
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT } }
    );
    const postings = Array.isArray(res.data) ? res.data : [];
    return postings
      .filter(j => isRelevantJob(j.text, j.descriptionPlain) && isEntryLevel(j.text, j.descriptionPlain))
      .map(j => normalizeJob({
        title: j.text,
        company: company.name,
        location: j.categories?.location,
        url: j.hostedUrl,
        jobId: j.id,
        description: j.descriptionPlain?.slice(0, 500),
        postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
        remote: j.categories?.commitment?.toLowerCase().includes('remote'),
      }));
  } catch {
    return [];
  }
}

// ─── Workable ATS ────────────────────────────────────────────────────────────

async function scrapeWorkable(company) {
  try {
    const res = await axios.get(
      `https://apply.workable.com/api/v3/accounts/${company.slug}/jobs`,
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT }, method: 'POST',
        data: { query: '', departmentId: '', workTypeId: '' } }
    );
    const jobs = res.data?.results || [];
    return jobs
      .filter(j => isRelevantJob(j.title, j.description) && isEntryLevel(j.title))
      .map(j => normalizeJob({
        title: j.title,
        company: company.name,
        location: j.location?.city || j.location?.country,
        url: `https://apply.workable.com/${company.slug}/j/${j.shortcode}`,
        jobId: j.shortcode,
        remote: j.remote,
      }));
  } catch {
    return [];
  }
}

// ─── Google Careers ───────────────────────────────────────────────────────────

async function scrapeGoogle(company) {
  try {
    const res = await axios.get(
      `https://careers.google.com/api/jobs/jobs-v1/search/?q=machine+learning+data+scientist&jex=ENTRY_LEVEL&hl=en_US&max_age=30`,
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT } }
    );
    const jobs = res.data?.jobs || [];
    return jobs
      .filter(j => isRelevantJob(j.job_title, j.job_description))
      .slice(0, 20)
      .map(j => normalizeJob({
        title: j.job_title,
        company: company.name,
        location: j.location?.[0]?.display,
        url: `https://careers.google.com/jobs/results/${j.job_id}`,
        jobId: j.job_id,
        description: j.job_description?.slice(0, 500),
        postedAt: j.posted_date,
      }));
  } catch {
    return [];
  }
}

// ─── Meta Careers ─────────────────────────────────────────────────────────────

async function scrapeMeta(company) {
  try {
    const res = await axios.post(
      'https://www.metacareers.com/graphql',
      {
        doc_id: '4060408930664951',
        variables: {
          search_input: {
            q: 'machine learning data scientist',
            page: 1,
            results_per_page: 20,
            teams: ['Artificial Intelligence', 'Data Infrastructure'],
          }
        }
      },
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/json' } }
    );
    const jobs = res.data?.data?.job_search?.jobs || [];
    return jobs
      .filter(j => isRelevantJob(j.title) && isEntryLevel(j.title))
      .map(j => normalizeJob({
        title: j.title,
        company: company.name,
        location: j.locations?.[0]?.city,
        url: `https://www.metacareers.com/jobs/${j.id}`,
        jobId: j.id,
        remote: j.is_remote,
      }));
  } catch {
    return [];
  }
}

// ─── Amazon Jobs ─────────────────────────────────────────────────────────────

async function scrapeAmazon(company) {
  try {
    const res = await axios.get(
      `https://www.amazon.jobs/en/search.json?base_query=machine+learning+data+scientist&job_type=Full-Time&result_limit=20`,
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT } }
    );
    const jobs = res.data?.jobs || [];
    return jobs
      .filter(j => isRelevantJob(j.title, j.description) && isEntryLevel(j.title))
      .map(j => normalizeJob({
        title: j.title,
        company: company.name,
        location: j.location,
        url: `https://www.amazon.jobs${j.job_path}`,
        jobId: j.id_icims,
        description: j.description?.slice(0, 500),
        postedAt: j.posted_date,
      }));
  } catch {
    return [];
  }
}

// ─── Microsoft Careers ────────────────────────────────────────────────────────

async function scrapeMicrosoft(company) {
  try {
    const res = await axios.get(
      `https://gcsservices.careers.microsoft.com/search/api/v1/search?q=machine+learning&l=en_us&pg=1&pgSz=20&o=Relevance&flt=true`,
      { timeout: TIMEOUT, headers: { 'User-Agent': USER_AGENT } }
    );
    const jobs = res.data?.operationResult?.result?.jobs || [];
    return jobs
      .filter(j => isRelevantJob(j.title, j.properties?.description) && isEntryLevel(j.title))
      .map(j => normalizeJob({
        title: j.title,
        company: company.name,
        location: j.properties?.primaryLocation,
        url: `https://jobs.careers.microsoft.com/global/en/job/${j.jobId}`,
        jobId: j.jobId,
        postedAt: j.properties?.postedDate,
      }));
  } catch {
    return [];
  }
}

// ─── Generic HTML Scraper Fallback ────────────────────────────────────────────

async function scrapeGeneric(company) {
  try {
    const res = await axios.get(company.careersUrl, {
      timeout: TIMEOUT,
      headers: { 'User-Agent': USER_AGENT }
    });
    const $ = cheerio.load(res.data);
    const jobs = [];
    $('a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href && isRelevantJob(text) && isEntryLevel(text)) {
        jobs.push(normalizeJob({
          title: text,
          company: company.name,
          url: href.startsWith('http') ? href : `${new URL(company.careersUrl).origin}${href}`,
        }));
      }
    });
    return jobs.slice(0, 10);
  } catch {
    return [];
  }
}

// ─── Main Scraper ─────────────────────────────────────────────────────────────

export async function scrapeCompany(company) {
  switch (company.useApi) {
    case 'greenhouse': return scrapeGreenhouse(company);
    case 'lever': return scrapeLever(company);
    case 'workable': return scrapeWorkable(company);
    case 'google': return scrapeGoogle(company);
    case 'meta': return scrapeMeta(company);
    case 'amazon': return scrapeAmazon(company);
    case 'microsoft': return scrapeMicrosoft(company);
    default: return scrapeGeneric(company);
  }
}

export async function scrapeAllCompanies() {
  const results = await Promise.allSettled(
    COMPANIES.map(company => scrapeCompany(company))
  );

  const allJobs = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value);
    } else {
      console.warn(`Failed to scrape ${COMPANIES[i].name}:`, result.reason?.message);
    }
  });

  // Deduplicate by job ID
  const seen = new Set();
  return allJobs.filter(job => {
    if (seen.has(job.id)) return false;
    seen.add(job.id);
    return true;
  });
}
