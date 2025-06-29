


// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ClientList.css";
// import { Jobsidebar } from "./Jobsidebar";
// import Jobsearch from "./Jobsearch";

// const normalise = (str = "") => str.toLowerCase().trim();

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

// export default function Jobportal() {
//   const navigate = useNavigate();

//   const [allJobs, setAllJobs] = useState([]);
//   const [filters, setFilters] = useState({ companies: [], locations: [] });
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("https://freelancer-finder.onrender.com/api/jobs");
//         const data = await res.json();
//         if (Array.isArray(data)) setAllJobs(data);
//       } catch (err) {
//         console.error("Failed to fetch jobs:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const jobs = useMemo(() => {
//     let list = allJobs;

//     if (filters.companies.length) {
//       list = list.filter((j) => filters.companies.includes(normalise(j.companyName)));
//     }

//     if (filters.locations.length) {
//       list = list.filter((j) => filters.locations.includes(normalise(j.location)));
//     }

//     if (query.trim()) {
//       const q = query.toLowerCase().trim();
//       list = list.filter((j) => j.jobTitle?.toLowerCase().includes(q));
//     }
//     return list;
//   }, [allJobs, filters, query]);
//   return (
//     <div className="job_page">
//       <Jobsidebar onFilterChange={setFilters} />

//       <div className="job_listings">
//         <Jobsearch onSearch={setQuery} />

//         <h2>Latest Jobs</h2>
//         <h3>Find your dream job</h3>

//         {loading ? (
//           <p>Loading jobs…</p>
//         ) : jobs.length === 0 ? (
//           <p>No jobs match those filters.</p>
//         ) : (
//           <div className="job_cards">
//             {jobs.map((job) => (
//               <div key={job._id} className="job_card">
//                 <img
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

//                 <h3 className="company-name">{job.companyName}</h3>
//                 <h3 className="job-title">{job.jobTitle}</h3>

//                 <div className="job_tags">
//                   <span>{job.location}</span>
//                   <span>{job.category}</span>
//                 </div>

//                 <p>{job.jobDescription?.slice(0, 150)}…</p>

//                 <div className="job_buttons">
//                   <button>Apply now</button>
//                   <button className="secondary" onClick={() => navigate(`/job/${job._id}`)}>
//                     Learn more
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientList.css";
import { Jobsidebar } from "./Jobsidebar";
import Jobsearch from "./Jobsearch";

/* ───── helpers ───── */
const normalise = (str = "") => str.toLowerCase().trim();

const processImageData = (imageData) => {
  if (!imageData) return "/default-avatar.png";

  // If the field already contains a data URI (sometimes wrapped in the uploads path)
  if (imageData.includes("data:image")) {
    const idx = imageData.indexOf("data:image");
    return imageData.slice(idx); // return pure data URI
  }

  // Full URL (https://…)
  if (/^https?:\/\//i.test(imageData)) return imageData;

  // Legacy filename – prepend our uploads path
  const clean = imageData.replace(/^[/\\]*(uploads[/\\]*)?/, "");
  return `https://freelancer-finder.onrender.com/uploads/${clean}`;
};
/* ─────────────────── */

export default function Jobportal() {
  const navigate = useNavigate();

  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState({ companies: [], locations: [] });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  /* fetch + normalise once */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://freelancer-finder.onrender.com/api/jobs"
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const fixed = data.map((j) => ({
            ...j,
            companyLogo: processImageData(j.companyLogo),
          }));
          setAllJobs(fixed);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* memoised client‑side filtering & search */
  const jobs = useMemo(() => {
    let list = allJobs;

    if (filters.companies.length) {
      list = list.filter((j) =>
        filters.companies.includes(normalise(j.companyName))
      );
    }

    if (filters.locations.length) {
      list = list.filter((j) =>
        filters.locations.includes(normalise(j.location))
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((j) => j.jobTitle?.toLowerCase().includes(q));
    }
    return list;
  }, [allJobs, filters, query]);

  /* ───── render ───── */
  return (
    <div className="job_page">
      <Jobsidebar onFilterChange={setFilters} />

      <div className="job_listings">
        <Jobsearch onSearch={setQuery} />

        <h2>Latest Jobs</h2>
        <h3>Find your dream job</h3>

        {loading ? (
          <p>Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p>No jobs match those filters.</p>
        ) : (
          <div className="job_cards">
            {jobs.map((job) => (
              <div key={job._id} className="job_card">
                <img
                  src={job.companyLogo}
                  alt="Company Logo"
                  style={{
                    borderRadius: "50%",
                    height: 60,
                    width: 60,
                    border: "2px solid white",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.warn("[logo] onError fired → default avatar");
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />

                <h3 className="company-name">{job.companyName}</h3>
                <h3 className="job-title">{job.jobTitle}</h3>

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
        )}
      </div>
    </div>
  );
}
