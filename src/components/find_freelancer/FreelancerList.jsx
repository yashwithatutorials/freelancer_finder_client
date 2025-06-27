import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopSearch from "./TopSearch";
import "../find_job/ClientList.css";

export default function FreelancerList() {
  const navigate = useNavigate();
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [filters, setFilters] = useState({ skills: [], locations: [] });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine the correct API base URL
  const getApiUrl = () => {
    // Check if we're in development
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      // Use local server if available, otherwise fallback to production
      return "http://localhost:8080";
    }
    return "https://freelancer-finder.onrender.com";
  };

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl();

        const res = await fetch(`${apiUrl}/api/freelancers`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        setAllFreelancers(data);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  // Enhanced profile image URL handler for base64 and legacy URLs
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) {
      return "/default-avatar.png";
    }

    // If it's a base64 data URL, return as is
    if (profileImage.startsWith("data:")) {
      return profileImage;
    }

    // If it's already a full URL (legacy support), use it as-is
    if (profileImage.startsWith("http")) {
      return profileImage;
    }

    // Fallback: construct URL manually for legacy filename-only data
    const cleanFile = profileImage.replace(/^[/\\]*(uploads[/\\]*)?/, "");
    return `https://freelancer-finder.onrender.com/uploads/${cleanFile}`;
  };

  const visible = useMemo(() => {
    let list = [...allFreelancers];

    if (filters.skills.length) {
      list = list.filter((f) =>
        f.skills?.some((s) => filters.skills.includes(s))
      );
    }
    if (filters.locations.length) {
      list = list.filter((f) => filters.locations.includes(f.location));
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  }, [allFreelancers, filters, query]);

  if (loading) return <div className="loading">Loading freelancers...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="job_page">
      <Sidebar onFilterChange={setFilters} />
      <div className="job_listings">
        <TopSearch onSearch={setQuery} />

        <h2>Available Freelancers</h2>
        <h3>Find talent for your next project</h3>

        <div className="job_cards">
          {visible.map((f) => (
            <div key={f._id || f.id} className="job_card">
              <img
                src={getProfileImageUrl(f.profileImage)}
                alt={`${f.name}'s profile`}
                className="job_logo"
                onError={(e) => {
                  console.warn(`Failed to load profile image for ${f.name}`);
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
              <h3>{f.name}</h3>

              <div className="job_tags">
                <span>{f.location || "Location not specified"}</span>
                {f.skills?.length ? (
                  <span>{f.skills[0]}</span>
                ) : (
                  <span>No skills listed</span>
                )}
              </div>

              <span>
                Experience: {f.experience || 0} year
                {f.experience !== 1 ? "s" : ""}
              </span>
              <p>
                Description:&nbsp;
                {f.description?.trim()
                  ? f.description.slice(0, 150) +
                    (f.description.length > 150 ? "..." : "")
                  : "Not provided"}
              </p>

              <div className="job_buttons">
                <button onClick={() => alert("Contact feature coming soon!")}>
                  Contact
                </button>
                <button
                  className="secondary"
                  onClick={() => navigate(`/freelancer/${f._id || f.id}`)}
                >
                  View profile
                </button>
              </div>
            </div>
          ))}

          {!visible.length && !loading && (
            <p>No freelancers match your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}
