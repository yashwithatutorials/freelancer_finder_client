import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewApplicants.css";

export default function ViewApplicants() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);  
  const [filterJobId, setFilterJobId] = useState("");
  const [jobCounts, setJobCounts] = useState({});

  useEffect(() => {
    if (!user.email || user.role !== "client") navigate("/login");
  }, [user, navigate]);


  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axios.get(`https://freelancer-finder.onrender.com/api/jobs?employer=${user.email}`),
          axios.get(`https://freelancer-finder.onrender.com/api/employers/applicants?email=${user.email}`),
        ]);

        setJobs(jobsRes.data);

        const flattened = appsRes.data.flatMap((freelancer) =>
          freelancer.applications.map((app) => ({
            ...app,
            id: freelancer.id,
            name: freelancer.name,
            email: freelancer.email,
            profileImage: freelancer.profileImage,
            skills: freelancer.skills,
            resume: freelancer.resume,
            freelancerEmail: freelancer.email,
          }))
        );

        setApps(flattened);
        const counts = {};
        flattened.forEach((a) => {
          const jobId = String(a.jobId);
          counts[jobId] = (counts[jobId] || 0) + 1;
        });
        setJobCounts(counts);
      } catch (err) {
        console.error("Fetch applicants error:", err);
      }
    })();
  }, [user.email]);

  const updateStatus = async (freelancerId, jobId, status) => {
    await axios.put("https://freelancer-finder.onrender.com/api/applications/status", {
      freelancerId,
      jobId,
      status,
    });
    setApps((prev) =>
      prev.map((a) =>
        a.id === freelancerId && a.jobId === jobId ? { ...a, status } : a
      )
    );
  };

  const filtered = filterJobId === "" ? apps : apps.filter((a) => a.jobId === filterJobId);

  return (
    <div className="view-applicants-container">
      <h1>Job Applicants</h1>

      <label className="filter-dropdown">
        Filter by Job:&nbsp;
        <select value={filterJobId} onChange={(e) => setFilterJobId(e.target.value)}>
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.jobTitle} ({jobCounts[String(j._id)] || 0})
            </option>
          ))}
        </select>
      </label>

      {filtered.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="applicants-grid">
          {filtered.map((a) => (
            <article key={`${a.jobId}-${a.id}`} className="applicant-card">
              <header>
                <img
                  src={a.profileImage || "/default-avatar.png"}
                  alt={a.name}
                />
                <div>
                  <h3>{a.name}</h3>
                  <p>{a.email}</p>
                  <p className="skills">{a.skills?.join(", ") || "—"}</p>
                </div>
              </header>

              <section className="application-block">
                <h4>{a.jobTitle}</h4>
                <small>
                  {a.applicationDate
                    ? new Date(a.applicationDate).toLocaleDateString()
                    : "Date not available"}
                </small>
                <label>
                  Status:&nbsp;
                  <select
                    value={a.status}
                    onChange={(e) =>
                      updateStatus(a.id, a.jobId, e.target.value)
                    }
                  >
                    {["pending", "reviewed", "rejected", "hired"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </section>
              <footer>
  {a.resume && (
    <a href={a.resume} target="_blank" rel="noreferrer" className="resume-btn">
      Résumé
    </a>
  )}


<button
className="contact-btn"
  onClick={() =>
navigate(
  `/messages?with=${a.email}&name=${encodeURIComponent(a.name)}&jobId=${a.jobId}`
)
  }>
  Chat
</button>

  {a.status === "pending" && (
    <>
      <button
        className="accept-btn"
        onClick={() => updateStatus(a.id, a.jobId, "hired")}
      >
        Accept
      </button>
      <button
        className="reject-btn"
        onClick={() => updateStatus(a.id, a.jobId, "rejected")}
      >
        Reject
      </button>
    </>
  )}
</footer>

            </article>
          ))}
        </div>
      )}
    </div>
  );
}
