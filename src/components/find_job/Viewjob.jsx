


import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Viewjob.css";

const fileURL = (f) =>
  f && !f.startsWith("http")
    ? `https://freelancer-finder.onrender.com/${f.startsWith("uploads/") ? "" : "uploads/"}${f}`
    : f || "/default-avatar.png";
const loadLocal = (email) =>
  JSON.parse(localStorage.getItem(`jobStatuses_${email}`) || "{}");
const saveLocal = (email, o) =>
  localStorage.setItem(`jobStatuses_${email}`, JSON.stringify(o));

export default function ViewJob() {
  const { jobId } = useParams();
  const email     = localStorage.getItem("email");

  const [jobs,     setJobs]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [statuses, setStatuses] = useState(() => loadLocal(email));
  useEffect(() => {
    (async () => {
      const { data=[] } = await axios.get("https://freelancer-finder.onrender.com/api/jobs");
      const fromServer  = {};
      data.forEach(j => {
        const a = j.applicants?.find(x => x.freelancerEmail === email);
        if (a) fromServer[j._id] = a.status;          
      });
      const merged = { ...loadLocal(email), ...fromServer };
      setStatuses(merged);
      saveLocal(email, merged);

      setJobs(data);
      setSelected(
        data.find(j => String(j._id) === String(jobId)) || data[0] || null
      );
    })();
  }, [email, jobId]);
  const apply = useCallback(async (job) => {
    if (!email) return alert("Please log in first");
    if (!job || statuses[job._id]) return;

    try {
      await axios.post(`https://freelancer-finder.onrender.com/api/jobs/${job._id}/apply`, { userEmail: email });
      setStatuses(prev => {
        const next = { ...prev, [job._id]: "pending" };
        saveLocal(email, next);
        return next;
      });
    } catch (err) {
      console.error(err); alert("Server error");
    }
  }, [email, statuses]);

  const related = selected
    ? jobs.filter(j => j.company === selected.company && j._id !== selected._id)
    : [];

  if (!selected) return <p>Loading…</p>;

  const pretty = (s) =>
    ({ pending:"PENDING", reviewed:"REVIEWED", hired:"HIRED", rejected:"REJECTED" }[s] || "APPLY");

  return (
    <div className="viewjob-container">
      <article key={selected._id} className="job-details">
        <header className="job-header">
          <div className="job-header-left">
            <img src={fileURL(selected.companyLogo)} alt="logo" />
            <div>
              <h2>{selected.jobTitle}</h2>
              <div className="job-meta">
                <span>🏢 {selected.companyName}</span>
                <span>📍 {selected.location}</span>
              </div>
            </div>
          </div>

          <button
            className={`btn-apply status-${statuses[selected._id] ?? "new"}`}
            disabled={!!statuses[selected._id]}
            onClick={() => apply(selected)}
          >
            {pretty(statuses[selected._id])}
          </button>
        </header>

        <h3 className="job-section-title">Job description</h3>
        <p>{selected.jobDescription}</p>

        <h3 className="job-section-title">Key Requirements</h3>
        <ol>
          {(selected.jobRequirement ?? []).map((r,i)=><li key={i}>{r}</li>)}
        </ol>

        <h3 className="job-section-title">Skills</h3>
        <p>{(selected.jobSkills ?? []).join(", ")}</p>
      </article>

      <aside className="related-jobs">
        <h3>More jobs from {selected.companyName}</h3>
        {related.slice(0,4).map(j => (
          <div key={j._id} className="related-job-card">
            <div className="related-job-header">
              <img src={fileURL(j.companyLogo)} alt="logo" />
              <h4>{j.jobTitle}</h4>
            </div>
            <p>{j.jobDescription.slice(0,90)}…</p>

            <button
              className={`btn-apply status-${statuses[j._id] ?? "new"}`}
              disabled={!!statuses[j._id]}
              onClick={() => apply(j)}
            >
              {pretty(statuses[j._id])}
            </button>

            <button className="btn-learn" onClick={() => setSelected(j)}>
              Learn more
            </button>
          </div>
        ))}
      </aside>
    </div>
  );
}


