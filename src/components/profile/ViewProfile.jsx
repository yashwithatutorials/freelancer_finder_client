import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./ViewProfile.css";

// Process image data - handle both base64 strings and legacy file URLs
const processImageData = (imageData) => {
  if (!imageData) return null;
  // If it's already a base64 data URL, return as is
  if (imageData.startsWith("data:")) return imageData;
  // If it's a full HTTP URL, return as is (legacy support)
  if (imageData.startsWith("http")) return imageData;
  // For legacy filename-only data, construct URL (will likely 404 due to ephemeral filesystem)
  const cleanFile = imageData.replace(/^[/\\]*(uploads[/\\]*)?/, "");
  return `https://freelancer-finder.onrender.com/uploads/${cleanFile}`;
};

const bustCache = (src, version = Date.now()) =>
  src ? `${src}${src.includes("?") ? "&" : "?"}v=${version}` : null;

export default function ViewProfile() {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const allSkills = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack",
    "Data Analyst",
    "Photography",
    "Video Editor",
    "Online Tutor",
  ];
  const skillOptions = allSkills.map((s) => ({ value: s, label: s }));

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    const parsed = JSON.parse(raw);

    // Normalize user data to handle both base64 and legacy URL formats
    const normalised = {
      ...parsed,
      profileImage: processImageData(parsed.profileImage),
      companyLogo: processImageData(parsed.companyLogo),
      resume: processImageData(parsed.resume),
      skills: parsed.skills || [],
    };

    setUser(normalised);
    setPhoneNumber(normalised.phoneNumber || "");
    setSkills(normalised.skills.map((v) => ({ value: v, label: v })));
    setLocation(normalised.location || "");
    setCompanyName(normalised.companyName || "");
    setDescription(normalised.description || "");
    setExperience(normalised.experience || "");
  }, []);

  const notify = (msg, ok) => {
    setPopupMessage(msg);
    setIsSuccess(ok);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleUpdate = async () => {
    if (!user) return;

    const fd = new FormData();
    fd.append("email", user.email);
    fd.append("phoneNumber", phoneNumber);
    fd.append("skills", JSON.stringify(skills.map((s) => s.value)));
    fd.append("location", location);

    if (user.role === "freelancer") {
      if (resumeFile) fd.append("resume", resumeFile);
      fd.append("experience", experience);
      fd.append("description", description);
    }

    if (user.role === "client") {
      if (companyLogoFile) fd.append("companyLogo", companyLogoFile);
      fd.append("companyName", companyName);
      fd.append("description", description);
    }

    // Handle profile image updates for both roles
    if (profileImageFile) {
      fd.append("profileImage", profileImageFile);
    }

    try {
      const res = await fetch(
        "https://freelancer-finder.onrender.com/api/employees/update",
        { method: "PUT", body: fd }
      );
      if (!res.ok) throw new Error(await res.text());

      const { success, updatedUser, message } = await res.json();
      if (!success) return notify(`Update failed: ${message}`, false);

      // Properly normalize the updated user data
      const normalised = {
        ...updatedUser,
        profileImage: processImageData(updatedUser.profileImage),
        companyLogo: processImageData(updatedUser.companyLogo),
        resume: processImageData(updatedUser.resume),
      };

      // Update both state and localStorage with properly formatted URLs
      localStorage.setItem("user", JSON.stringify(normalised));
      setUser(normalised);

      // Reset file inputs and previews
      setResumeFile(null);
      setCompanyLogoFile(null);
      setProfileImageFile(null);
      setPreviewLogo(null);
      setPreviewProfile(null);

      notify("Profile updated successfully!", true);

      // Dispatch custom event to notify navbar of profile update
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: normalised,
        })
      );

      // Force page reload to update navbar profile picture
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      notify(`Update failed: ${err.message}`, false);
    }
  };

  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCompanyLogoFile(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const onProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImageFile(file);
    setPreviewProfile(URL.createObjectURL(file));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {showPopup && (
        <div
          className={`popup-notification ${isSuccess ? "success" : "error"}`}
        >
          {popupMessage}
        </div>
      )}

      <div className="Profile">
        <div className="profile-image-section">
          <img
            src={previewProfile || user.profileImage || "/default-profile.png"}
            alt="Profile"
            style={{ borderRadius: "50%", height: "250px", width: "250px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <label
              htmlFor="profileImageInput"
              style={{ cursor: "pointer", color: "#4CAF50" }}
            >
              <strong>Change Profile Picture</strong>
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={onProfileImageChange}
              style={{ display: "block", marginTop: "5px", color: "white" }}
            />
          </div>
        </div>

        <div className="profile-details">
          <h3>
            <strong>Name:</strong> {user.name}
          </h3>
          <h3>
            <strong>Email:</strong> {user.email}
          </h3>
          <h3>
            <strong>Role:</strong> {user.role}
          </h3>

          <h3>
            <strong>Location:</strong>{" "}
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
            />
          </h3>

          <h3>
            <strong>Description:</strong>
          </h3>
          <textarea
            className="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell something about yourself…"
          />

          {user.role === "freelancer" && (
            <div className="freelancer-section">
              <h3>
                <strong>Skills:</strong>
              </h3>
              <Select
                isMulti
                options={skillOptions}
                value={skills}
                onChange={setSkills}
                className="Select"
                placeholder="Select skills…"
              />

              <h3>
                <strong>Experience (yrs):</strong>{" "}
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  style={{ width: "80px" }}
                />
              </h3>

              <h3>
                <strong>Résumé:</strong>
              </h3>
              {user.resume && (
                <a
                  href={
                    user.resume.startsWith("data:") ? user.resume : user.resume
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  download={
                    user.resume.startsWith("data:") ? "resume.pdf" : undefined
                  }
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  View / download
                </a>
              )}
              <input
                type="file"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />

              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
            </div>
          )}

          {user.role === "client" && (
            <div className="client-section">
              <h3>
                <strong>Company Name:</strong>{" "}
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input"
                />
              </h3>

              <h3>
                <strong>Company Logo:</strong>
              </h3>
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Preview logo"
                  style={{ width: 100, height: 100, marginBottom: 10 }}
                />
              ) : (
                user.companyLogo && (
                  <img
                    src={user.companyLogo}
                    alt="Company logo"
                    style={{ width: 100, height: 100, marginBottom: 10 }}
                  />
                )
              )}
              <input type="file" accept="image/*" onChange={onLogoChange} />

              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
