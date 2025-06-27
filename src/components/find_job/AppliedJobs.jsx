import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AppliedJobs.css";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    if (!user.email || user.role !== "freelancer") {
      navigate("/login");
      return;
    }

   axios.get(`https://freelancer-finder.onrender.com/api/jobs`)
  .then((res) => {
    const jobs = res.data;
    console.log("Jobs received:", jobs); 
    const myJobs = jobs.filter(j =>
      j.applicants?.some(a => a.freelancerEmail === user.email)
    );
    setAppliedJobs(myJobs);
  })
      .catch((err) => console.error("Fetch applied jobs error", err));
  }, [user.email, user.role, navigate]);
 const fileURL = (f) =>
    f && !f.startsWith("http")
      ? `https://freelancer-finder.onrender.com/${f.startsWith("uploads/") ? "" : "uploads/"}${f}`
      : f || "/default-avatar.png";
  return (
    <div className="applied-jobs-page">
      <h2>My Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="job-list">
          {appliedJobs.map((job) => (
           <div key={job._id} className="job-card" >
           <img src={fileURL(job.companyLogo)} alt="logo" style={{width:"50px"}}/>
           <h3>{job.companyName}</h3>
  <h3>{job.jobTitle || "Untitled Job"}</h3>

  <p>{job.jobDescription || "No description available."}</p>
 <button
 className="chat-btn"
  onClick={() => {
    if (!job.employerEmail) {
      alert("Chat not available: employer email missing");
      return;
    }

navigate(`/messages?with=${job.employerEmail}&name=${job.company}&jobId=${job._id}`);
  }}
>
  Chat
</button>

</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
