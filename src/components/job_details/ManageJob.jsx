



import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageJob.css";

const ManageJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const email = JSON.parse(localStorage.getItem("user") || "{}").email;

  const showNotification = (message, success) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  // useEffect(() => {
  //   if (!email) {
  //     setError("User email missing.");
  //     setLoading(false);
  //     return;
  //   }

  //   axios
  //     .get("https://freelancer-finder.onrender.com/api/jobs", { params: { email } })
  //     .then((res) => {
  //       setJobs(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setError("Failed to load jobs");
  //       showNotification("Failed to load jobs", false);
  //     });
  // }, [email]);
  useEffect(() => {
  if (!email) {
    setError("User email missing.");
    setLoading(false);
    return;
  }

  axios
    .get("https://freelancer-finder.onrender.com/api/jobs", { params: { email } })
    .then(res => {
      const myJobs = res.data.filter(j => j.employerEmail === email);
      setJobs(myJobs);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load jobs");
      showNotification("Failed to load jobs", false);
      setLoading(false);                     // ← add this
    });
}, [email]);

  const confirmDelete = (id) => {
    setJobToDelete(id);
    setPopupMessage("Are you sure you want to delete this job?");
    setIsSuccess(false);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://freelancer-finder.onrender.com/api/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      showNotification("Job deleted successfully", true);
    } catch (err) {
      console.error(err);
      showNotification("Delete failed - please try again", false);
    }
    setJobToDelete(null);
  };

  if (loading) return <p className="status">Loading…</p>;
  if (error) return <p className="status error">{error}</p>;
  if (!jobs.length) return <p className="status">You haven't posted any jobs yet.</p>;

  return (
    <>
      {showPopup && (
        <div className={`popup-notification ${isSuccess ? "success" : "error"}`}>
          {popupMessage}
          {!isSuccess && jobToDelete && (
            <div className="popup-buttons">
              <button
                onClick={() => {
                  handleDelete(jobToDelete);
                  setShowPopup(false);
                }}
                className="popup-confirm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="popup-cancel"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    <div className="manage">
    

      <div className="manage-jobs">
        <h2 style={{ background: "none" }}>Your Posted Jobs</h2>
        <h3>Your Posted jobs</h3>

        <div className="card-grid">
          {jobs.map((job) => (
            <article key={job._id} className="job-card" style={{ background: "none" }}>
              <header>
                <h3>{job.jobTitle}</h3>
                <p className="meta">
                  {job.category} • {job.location}
                </p>
              </header>

              <p className="desc">Description: {job.jobDescription}</p>

              <h4>Responsibilities</h4>
              <ul>
                {(job.jobRequirement || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>Skills Required</h4>
              <ul>
                {(job.jobSkills || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <button
                className="delete-btn"
                onClick={() => confirmDelete(job._id)}
              >
                Delete Job
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ManageJob;
