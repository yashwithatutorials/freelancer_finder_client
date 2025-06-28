import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../images/sb_works.jpg";
import "./LoginNav.css";

const LoginNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Process profile image - handle base64 and legacy URLs
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) {
      return "/default-avatar.png";
    }

    // If it's a base64 data URL, return as is
    if (profileImage.startsWith("data:")) {
      return profileImage;
    }

    // If it's a full HTTP URL, return as is (legacy support)
    if (profileImage.startsWith("http")) {
      return profileImage;
    }

    // For legacy filename-only data, construct URL (will likely 404 due to ephemeral filesystem)
    const cleanFile = profileImage.replace(/^[/\\]*(uploads[/\\]*)?/, "");
    return `https://freelancer-finder.onrender.com/uploads/${cleanFile}`;
  };

  useEffect(() => {
    // Load user data and set up periodic refresh for profile image updates
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();

    // Listen for storage changes to update profile when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from profile updates
    const handleProfileUpdate = () => {
      loadUser();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    setUser(null);
    setShowProfile(false);
    showNotification("Successfully logged out!", true);
    setTimeout(() => {
      window.location.href = "/Home";
    }, 1000);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const showNotification = (message, success) => {
    setPopupMessage(message);
    setIsSuccess(success);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <>
      {showPopup && (
        <div
          className={`popup-notification ${isSuccess ? "success" : "error"}`}
        >
          {popupMessage}
        </div>
      )}
      <nav className="mainnav ">
        <img src={logo} alt="logo" className="logo" />
        <div className="bar" onClick={toggleMenu}>
          <MenuIcon style={{ fontSize: "50px" }} />
        </div>
        <div className={`cont ${menuOpen ? "show" : ""}`}>
          <div className="nav-spacer"></div>

          <div className="nav-right-content">
            <div className="nav-tab">
              <a href="/Home" className="ab">
                Home
              </a>
              <a href="#about-section" className="ab">
                About
              </a>
              {!user && (
                <>
                  <a href="/Login" className="ab">
                    Find Freelancer
                  </a>
                  <a href="/Login" className="ab">
                    Find Job
                  </a>
                </>
              )}
              {user?.role === "client" && (
                <>
                  <a href="/freelancer_finder" className="ab">
                    Find Freelancer
                  </a>
                  <a href="/jobdetails" className="ab">
                    Job Details
                  </a>
                </>
              )}
              {user?.role === "freelancer" && (
                <>
                  <a href="/jobportal" className="ab">
                    Find job
                  </a>
                  <a href="/appliedjobs" className="ab">
                    Applied Jobs
                  </a>
                </>
              )}
            </div>
            {user ? (
              <div
                className="profile-wrapper"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="pro">
                  <img
                    src={getProfileImageUrl(user.profileImage)}
                    alt="Profile"
                    style={{
                      borderRadius: "50%",
                      height: "60px",
                      width: "60px",
                      border: "2px solid #4CAF50",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />

                  <h3 style={{ color: "white", textAlign: "center" }}>
                    {user.name}
                  </h3>
                </div>

                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="text-center" style={{ padding: "10px" }}>
                      <button className="view">
                        <a
                          href="/ViewProfile"
                          style={{
                            textDecoration: "none",
                            color: "white",
                            fontWeight: "600",
                            fontSize:"16px"
                          }}
                        >
                          View Profile
                        </a>
                      </button>
                      <button onClick={logout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mainnav1">
                <a href="/Login" className="lo">
                  <button className="go1">Log In</button>
                </a>
                <a href="/Signup" className="lo">
                  <button className="go2">Sign Up</button>
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default LoginNav;
