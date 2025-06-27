import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Details.css";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [otherFreelancers, setOtherFreelancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getId = (f) => String(f._id ?? f.id);

  // Determine the correct API base URL
  const getApiUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8080";
    }
    return "https://freelancer-finder.onrender.com";
  };

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

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setIsLoading(true);
        const apiUrl = getApiUrl();

        const res = await fetch(`${apiUrl}/api/freelancers`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const current = data.find((f) => getId(f) === id);
        const others = data.filter((f) => getId(f) !== id);

        setFreelancer(current);
        setOtherFreelancers(others);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelancers();
  }, [id]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!freelancer) return <div className="not-found">Freelancer not found</div>;

  return (
    <div className="details-container">
      <div className="main-content">
        <div className="freelancer-card">
          <div className="freelancer-header">
            <img
              src={getProfileImageUrl(freelancer.profileImage)}
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                console.warn(`Failed to load profile image for freelancer`);
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="freelancer-info">
              <h2>{freelancer.name}</h2>
              <p className="email">{freelancer.email}</p>
            </div>
          </div>

          <div className="freelancer-details">
            <div className="detail-item">
              <strong>Location:</strong>{" "}
              {freelancer.location || "Not specified"}
            </div>
            <div className="detail-item">
              <strong>Experience:</strong> {freelancer.experience || 0} years
            </div>
            <div className="detail-item">
              <strong>Skills:</strong>{" "}
              {freelancer.skills?.join(", ") || "No skills listed"}
            </div>
            <div className="detail-item">
              <strong>Projects:</strong>{" "}
              {freelancer.projects || "No projects listed"}
            </div>
            <div className="detail-item description">
              <strong>Description:</strong>{" "}
              {freelancer.description || "No description provided"}
            </div>

            {freelancer.resume && (
              <div className="resume-section">
                <a
                  href={freelancer.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  📄 View Resume (PDF)
                </a>
                <a
                  href={freelancer.resume}
                  download={
                    freelancer.resume.startsWith("data:")
                      ? "resume.pdf"
                      : undefined
                  }
                  className="download-link"
                >
                  📥 Download Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <h3 className="sidebar-title">Other Freelancers</h3>
        <div className="other-freelancers-grid">
          {otherFreelancers.slice(0, 3).map((f) => (
            <div
              key={getId(f)}
              className="other-freelancer-card"
              onClick={() => navigate(`/freelancer/${getId(f)}`)}
            >
              <img
                src={getProfileImageUrl(f.profileImage)}
                alt={f.name}
                className="other-profile-image"
                onError={(e) => {
                  console.warn(`Failed to load profile image for freelancer`);
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
              <h4>{f.name}</h4>
              <p className="other-location">
                {f.location || "Location not specified"}
              </p>
              <p className="other-experience">
                Experience: {f.experience || 0} years
              </p>
              <p className="other-skills">
                {f.skills?.slice(0, 2).join(", ") || "No skills"}
              </p>

              <div className="action-buttons">
                <button
                  className="contact-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Contact feature coming soon!");
                  }}
                >
                  Contact
                </button>
                <button
                  className="profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/freelancer/${getId(f)}`);
                  }}
                >
                  View profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {otherFreelancers.length === 0 && (
          <p>No other freelancers available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Details;
