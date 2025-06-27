import React, { useState } from 'react';
import AddJob from './Postjob';
import ManageJobs from './ManageJob';
import ViewApplications from './ViewApplicants';
import './Job_details.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
const Job_details = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="job_pages" >
     <div className="job_sidebar">
  <button onClick={() => setActiveTab("add")} className="sidebar-button">
    <AddCircleIcon style={{ color: "skyblue", fontSize: "44px" }} />
    <span className="sidebar-text">Job</span>
  </button>

  <button onClick={() => setActiveTab("manage")} className="sidebar-button">
    <WorkIcon style={{ color: "skyblue", fontSize: "44px" }} />
    <span className="sidebar-text">Manage Jobs</span>
  </button>

  <button onClick={() => setActiveTab("applications")} className="sidebar-button">
    <PersonIcon style={{ color: "skyblue", fontSize: "44px" }} />
    <span className="sidebar-text">View Applications</span>
  </button>
</div>


      <div className="job_main">
        {activeTab === "add" && <AddJob />}
        {activeTab === "manage" && <ManageJobs />}
        {activeTab === "applications" && <ViewApplications />}
      </div>
    </div>
  );
};

export default Job_details;
