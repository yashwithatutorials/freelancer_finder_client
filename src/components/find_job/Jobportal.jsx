import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientList.css";
import Jobsidebar from "./Jobsidebar";
import Jobsearch  from "./Jobsearch";

export default function Jobportal() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ categories: [], locations: [] });
  const [query,   setQuery]   = useState("");
  const [jobs,    setJobs]    = useState([]);
  const fetchJobs = useCallback(async () => {
    const res  = await fetch("https://freelancer-finder.onrender.com/api/jobs");
    const data = await res.json();
    if (!Array.isArray(data)) return;

    let list = data;
    if (filters.categories.length)
      list = list.filter(j => filters.categories.includes(j.category));
    if (filters.locations.length)
      list = list.filter(j => filters.locations.includes(j.location));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(j => j.jobTitle?.toLowerCase().includes(q));
    }
    setJobs(list);
  }, [filters, query]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

//  const fileURL = (f) =>
//   f?.startsWith("https") ? f
//   : f ? `https://freelancer-finder.onrender.com/uploads/${f.replace(/^uploads[\\/]/, "")}`
//   : "/default-avatar.png";
const fileURL = (filename) => {
  if (!filename) return "/default-company-logo.png";
  if (filename.startsWith("http")) return filename;
  
  const baseUrl = `https://freelancer-finder.onrender.com/uploads/${filename.replace(/^uploads[\\/]/, "")}`;
  return `${baseUrl}?v=${Date.now()}`; // Cache busting
};
console.log("Job data:", jobs.map(job => ({
  id: job._id,
  title: job.jobTitle,
  companyLogo: job.companyLogo,
  employerLogo: job.employer?.companyLogo,
  profileImage: job.employer?.profileImage
})));
  return (
    <div className="job_page">
      <Jobsidebar onFilterChange={setFilters} />
      <div className="job_listings">
        <Jobsearch onSearch={setQuery} />

        <h2>Latest Jobs</h2>
        <h3>Find your dream job</h3>

        <div className="job_cards">
          {jobs.map((job) => (
            <div key={job._id} className="job_card">
              {/* <img src={fileURL(job.companyLogo)} alt="logo" /> */}
             
<img 
  src={fileURL(job.companyLogo)} 
  alt={`${job.companyName} logo`}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default-company-logo.png";
  }}
  className="company-logo" // Add specific class
/>
              <h3 style={{ fontWeight: 700, fontSize: 32 }}>{job.companyName}</h3>
              <h3>{job.jobTitle}</h3>
              <div className="job_tags">
                <span>{job.location}</span>
                <span>{job.category}</span>
              </div>
              <p>{job.jobDescription?.slice(0, 150)}…</p>
              <div className="job_buttons">
                <button>Apply now</button>
                <button
                  className="secondary"
                  onClick={() => navigate(`/job/${job._id}`)}
                >
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
