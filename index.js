// pages/index.js
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { COMPANIES } from '../lib/companies';

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextRefresh, setNextRefresh] = useState(REFRESH_INTERVAL);
  const [isMock, setIsMock] = useState(false);
  const timerRef = useRef(null);

  const fetchJobs = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        company: selectedCompany,
        remote: remoteOnly,
        page: p,
      });
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
      setLastUpdated(data.lastUpdated);
      setIsMock(data.isMock || false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCompany, remoteOnly]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchJobs(1);
    setPage(1);
  }, [search, selectedCompany, remoteOnly]);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 min
    const interval = setInterval(() => {
      fetchJobs(page);
      fetchStats();
      setNextRefresh(REFRESH_INTERVAL);
    }, REFRESH_INTERVAL);

    // Countdown
    timerRef.current = setInterval(() => {
      setNextRefresh(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerRef.current);
    };
  }, []);

  function timeAgo(dateStr) {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function formatCountdown(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  const companyNames = [...new Set(COMPANIES.map(c => c.name))].sort();

  return (
    <>
      <Head>
        <title>ML Job Tracker — AI & Data Science Jobs</title>
        <meta name="description" content="Live ML, AI, and Data Science jobs from top 100 tech companies. Updated every 30 minutes. Entry-level and junior positions only." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="header">
          <div className="header-inner">
            <div className="logo-block">
              <span className="logo-pulse" />
              <div>
                <h1 className="logo-title">ML Job Radar</h1>
                <p className="logo-sub">Entry-level AI &amp; Data jobs · Live from 100+ companies</p>
              </div>
            </div>
            <div className="header-meta">
              {isMock && <span className="badge badge-mock">Demo Mode</span>}
              <div className="refresh-info">
                <span className="refresh-dot" />
                <span className="refresh-text">Next refresh in <strong>{formatCountdown(nextRefresh)}</strong></span>
              </div>
              {lastUpdated && (
                <span className="last-updated">Last updated {timeAgo(lastUpdated)}</span>
              )}
            </div>
          </div>
        </header>

        {/* ── Stats ──────────────────────────────────────────────── */}
        {stats && (
          <div className="stats-bar">
            <div className="stat-card">
              <span className="stat-num">{stats.totalJobs.toLocaleString()}</span>
              <span className="stat-label">Open Roles</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{stats.totalCompanies}</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{stats.remoteJobs}</span>
              <span className="stat-label">Remote Jobs</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">30<span className="stat-unit">min</span></span>
              <span className="stat-label">Refresh Rate</span>
            </div>
          </div>
        )}

        {/* ── Filters ────────────────────────────────────────────── */}
        <div className="filters">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search roles, companies, skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <select
            className="select-filter"
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
          >
            <option value="">All Companies</option>
            {companyNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <button
            className={`remote-toggle ${remoteOnly ? 'active' : ''}`}
            onClick={() => setRemoteOnly(r => !r)}
          >
            🌐 Remote Only
          </button>

          <span className="results-count">
            {total.toLocaleString()} jobs found
          </span>
        </div>

        {/* ── Job Grid ───────────────────────────────────────────── */}
        <main className="main">
          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or check back in a few minutes.</p>
            </div>
          ) : (
            <div className="job-grid">
              {jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} timeAgo={timeAgo} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => { setPage(p => p - 1); fetchJobs(page - 1); }}
                disabled={page <= 1}
              >← Prev</button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button
                className="page-btn"
                onClick={() => { setPage(p => p + 1); fetchJobs(page + 1); }}
                disabled={page >= totalPages}
              >Next →</button>
            </div>
          )}
        </main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="footer">
          <p>Scraping {COMPANIES.length} top tech companies every 30 min · Entry-level &amp; junior roles only · {new Date().getFullYear()}</p>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #080b12;
          color: #e2e8f0;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .app {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Header ── */
        .header {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 1.5rem 0;
          position: sticky;
          top: 0;
          background: rgba(8,11,18,0.95);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .logo-block {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .logo-pulse {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 0 0 rgba(0,255,136,0.4);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,255,136,0.5); }
          70% { box-shadow: 0 0 0 10px rgba(0,255,136,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,255,136,0); }
        }
        .logo-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #00ff88 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .logo-sub {
          font-size: 0.75rem;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 2px;
        }
        .header-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .badge-mock {
          background: rgba(251,191,36,0.15);
          color: #fbbf24;
          border: 1px solid rgba(251,191,36,0.3);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-family: 'JetBrains Mono', monospace;
        }
        .refresh-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #64748b;
        }
        .refresh-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00ff88;
          animation: pulse 2s infinite;
        }
        .refresh-text strong { color: #94a3b8; font-family: 'JetBrains Mono', monospace; }
        .last-updated { font-size: 0.72rem; color: #475569; }

        /* ── Stats ── */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          padding: 2rem 0 1rem;
        }
        @media (max-width: 600px) { .stats-bar { grid-template-columns: repeat(2,1fr); } }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.2rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: rgba(0,255,136,0.2); }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .stat-unit { font-size: 1rem; color: #00ff88; margin-left: 2px; }
        .stat-label { font-size: 0.72rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }

        /* ── Filters ── */
        .filters {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 0 1rem;
          flex-wrap: wrap;
        }
        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 260px;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #475569;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.7rem 2.5rem 0.7rem 2.6rem;
          color: #e2e8f0;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .search-input::placeholder { color: #475569; }
        .search-input:focus { border-color: rgba(0,255,136,0.4); background: rgba(255,255,255,0.07); }
        .search-clear {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.2rem;
        }
        .select-filter {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          color: #e2e8f0;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          cursor: pointer;
          min-width: 170px;
        }
        .select-filter:focus { border-color: rgba(0,255,136,0.4); }
        .remote-toggle {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.7rem 1.2rem;
          color: #94a3b8;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .remote-toggle.active {
          background: rgba(0,255,136,0.12);
          border-color: rgba(0,255,136,0.4);
          color: #00ff88;
        }
        .results-count {
          font-size: 0.78rem;
          color: #475569;
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap;
          margin-left: auto;
        }

        /* ── Job Grid ── */
        .main { padding-bottom: 4rem; }
        .job-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .skeleton-card {
          height: 180px;
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          border-radius: 14px;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .empty-state {
          text-align: center;
          padding: 6rem 2rem;
          color: #475569;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-state h3 { font-family: 'Syne', sans-serif; font-size: 1.2rem; color: #94a3b8; margin-bottom: 0.5rem; }

        /* ── Job Card ── */
        .job-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.4rem;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          animation: fadeUp 0.4s both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .job-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0,255,136,0.25);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 8px 40px rgba(0,255,136,0.06);
        }
        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .company-logo {
          font-size: 1.6rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .card-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; }
        .badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .badge-remote {
          background: rgba(0,255,136,0.1);
          color: #00ff88;
          border: 1px solid rgba(0,255,136,0.25);
        }
        .badge-new {
          background: rgba(251,191,36,0.1);
          color: #fbbf24;
          border: 1px solid rgba(251,191,36,0.25);
        }
        .badge-time {
          color: #475569;
          font-size: 0.68rem;
          font-family: 'JetBrains Mono', monospace;
        }
        .job-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.3;
        }
        .company-name {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .company-name strong { color: #cbd5e1; }
        .job-location {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
        }
        .job-description {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .apply-btn {
          font-size: 0.75rem;
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: gap 0.2s;
        }
        .job-card:hover .apply-btn { gap: 0.5rem; }

        /* ── Pagination ── */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem 0;
        }
        .page-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          color: #94a3b8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) { border-color: rgba(0,255,136,0.4); color: #00ff88; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .page-info { font-size: 0.8rem; color: #475569; font-family: 'JetBrains Mono', monospace; }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1.5rem 0;
          text-align: center;
          font-size: 0.72rem;
          color: #334155;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </>
  );
}

function JobCard({ job, index, timeAgo }) {
  const company = COMPANIES.find(c => c.name === job.company);
  const logo = company?.logo || '🏢';
  const isNew = Date.now() - new Date(job.postedAt).getTime() < 24 * 3600000;

  return (
    <a
      href={job.url !== '#' ? job.url : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="job-card"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="card-top">
        <span className="company-logo">{logo}</span>
        <div className="card-badges">
          {job.remote && <span className="badge badge-remote">Remote</span>}
          {isNew && <span className="badge badge-new">New</span>}
          <span className="badge-time">{timeAgo(job.postedAt)}</span>
        </div>
      </div>

      <div>
        <div className="job-title">{job.title}</div>
        <div className="company-name" style={{ marginTop: '0.3rem' }}>
          <strong>{job.company}</strong>
        </div>
      </div>

      {job.location && (
        <div className="job-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          {job.location}
        </div>
      )}

      {job.description && (
        <p className="job-description">{job.description}</p>
      )}

      <div className="card-footer">
        <span className="apply-btn">
          Apply now →
        </span>
      </div>
    </a>
  );
}
