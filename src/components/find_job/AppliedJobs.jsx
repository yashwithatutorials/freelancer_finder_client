// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./AppliedJobs.css";

// const AppliedJobs = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const [appliedJobs, setAppliedJobs] = useState([]);

//   useEffect(() => {
//     if (!user.email || user.role !== "freelancer") {
//       navigate("/login");
//       return;
//     }

//    axios.get(`https://freelancer-finder.onrender.com/api/jobs`)
//   .then((res) => {
//     const jobs = res.data;
//     console.log("Jobs received:", jobs); 
//     const myJobs = jobs.filter(j =>
//       j.applicants?.some(a => a.freelancerEmail === user.email)
//     );
//     setAppliedJobs(myJobs);
//   })
//       .catch((err) => console.error("Fetch applied jobs error", err));
//   }, [user.email, user.role, navigate]);
// //  const fileURL = (f) =>
// //     f && !f.startsWith("http")
// //       ? `https://freelancer-finder.onrender.com/${f.startsWith("uploads/") ? "" : "uploads/"}${f}`
// //       : f || "/default-avatar.png";
// const getProfileImageUrl = (companyLogo) => {
//     if (!companyLogo) {
//       return "/default-avatar.png";
//     }
//     // If it's a base64 data URL, return as is
//     if (companyLogo.startsWith("data:")) {
//       return companyLogo;
//     }
//     // If it's a full HTTP URL, return as is (legacy support)
//     if (companyLogo.startsWith("http")) {
//       return companyLogo;
//     }
//     // For legacy filename-only data, construct URL (will likely 404 due to ephemeral filesystem)
//     const cleanFile = companyLogo.replace(/^[/\\]*(uploads[/\\]*)?/, "");
//     return `https://freelancer-finder.onrender.com/uploads/${cleanFile}`;
//   };
//   return (
//     <div className="applied-jobs-page">
//       <h2>My Applied Jobs</h2>
//       {appliedJobs.length === 0 ? (
//         <p>You haven’t applied to any jobs yet.</p>
//       ) : (
//         <div className="job-list">
//           {appliedJobs.map((job) => (
//            <div key={job._id} className="job-card" >
//            {/* <img src={fileURL(job.companyLogo)} alt="logo" style={{width:"50px"}}/> */}
//            <img
//                     src={getProfileImageUrl(job.companyLogo)}
//                     alt="Profile"
//                     style={{
//                       borderRadius: "50%",
//                       height: "60px",
//                       width: "60px",
//                       border: "2px solid #4CAF50",
//                       objectFit: "cover",
//                     }}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "/default-avatar.png";
//                     }}
//                   />
//            <h3>{job.companyName}</h3>
//   <h3>{job.jobTitle || "Untitled Job"}</h3>

//   <p>{job.jobDescription || "No description available."}</p>
//  <button
//  className="chat-btn"
//   onClick={() => {
//     if (!job.employerEmail) {
//       alert("Chat not available: employer email missing");
//       return;
//     }

// navigate(`/messages?with=${job.employerEmail}&name=${job.company}&jobId=${job._id}`);
//   }}
// >
//   Chat
// </button>

// </div>

//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppliedJobs;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AppliedJobs.css";

/* ───────── helper to normalise companyLogo ───────── */
const MAX_DATA_URI_SIZE = 2_000_000; 

const processImageData = (imageData) => {
  if (!imageData) {
    console.info("[logo] → null/undefined → default avatar");
    return "/default-avatar.png";
  }

  // If it's already a data URI (mistakenly saved inside the uploads path), extract it
  if (imageData.includes("data:image")) {
    const dataIndex = imageData.indexOf("data:image");
    const base64Part = imageData.slice(dataIndex);
    console.info("[logo] extracted embedded data URI");
    return base64Part;
  }

  // If it's a full http(s) URL
  if (/^https?:\/\//i.test(imageData)) {
    console.info("[logo] full http url →", imageData);
    return imageData;
  }

  // Otherwise, treat as legacy filename
  const clean = imageData.replace(/^[/\\]*(uploads[/\\]*)?/, "");
  const url = `https://freelancer-finder.onrender.com/uploads/${clean}`;
  console.info("[logo] legacy file", url);
  return url;
};

/* ─────────────────────────────────────────────────── */

export default function AppliedJobs() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [applied, setApplied] = useState([]);

  useEffect(() => {
    if (!user.email || user.role !== "freelancer") {
      navigate("/login");
      return;
    }

    axios
      .get("https://freelancer-finder.onrender.com/api/jobs")
      .then(({ data }) => {
        const list = data
          .filter((j) =>
            j.applicants?.some((a) => a.freelancerEmail === user.email)
          )
          .map((j) => ({
            ...j,
            companyLogo: processImageData(j.companyLogo),
          }));
        setApplied(list);
      })
      .catch((err) => console.error("Fetch applied jobs error →", err));
  }, [navigate, user.email, user.role]);

  return (
    <div className="applied-jobs-page">
      <h2>My Applied Jobs</h2>

      {applied.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="job-list">
          {applied.map((job) => (
            <div key={job._id} className="job-card">
              <img
                src={job.companyLogo}
                alt="Company Logo"
                style={{
                  borderRadius: "50%",
                  height: 60,
                  width: 60,
                  border: "2px solid #4CAF50",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  console.warn("[logo] onError fired → default avatar");
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />

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
                  navigate(
                    `/messages?with=${job.employerEmail}&name=${job.company}&jobId=${job._id}`
                  );
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
}



