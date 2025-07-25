

// import React, { useState, useEffect } from 'react';
// import '../find_freelancer/Sidebar.css'

// export default function Jobsidebar({ onFilterChange }) {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedLocations, setSelectedLocations] = useState([]);
// const [showFilters, setShowFilters] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const categories = [ 'Frontend Developer', 'Backend Developer', 'Full Stack',
//   'Data Analyst', 'Graphic Designer', 'Management', 'Tutor',
//   'Video Editor', 'Photography', 'Financial Advisor'];
//   const locations = ['Bangalore', 'Mumbai', 'Hyderabad', 'Delhi'];
//  useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       setShowFilters(!mobile); 
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize(); 

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     onFilterChange({
//       categories: selectedCategories,
//       locations: selectedLocations,
//     });
//   }, [selectedCategories, selectedLocations, onFilterChange]);


//   const toggleSelection = (value, setState, state) => {
//     if (state.includes(value)) {
//       setState(state.filter(v => v !== value));
//     } else {
//       setState([...state, value]);
//     }
//   };

//   return (
//     <div className='side'>
//     <aside className="sidebar">
//      {isMobile && (
//           <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         )}

//         {(!isMobile || showFilters) && (
//           <>
//       <h3>Filter By</h3>

//       <div className="filter-group">
//         <h4 style={{color:"skyblue",fontSize:"27px",padding:"9px",fontWeight:"900"}}>Category</h4>
//         {categories.map(cat => (
//           <label key={cat}>
//             <input
//               type="checkbox"
//               value={cat}
//               checked={selectedCategories.includes(cat)}
//               onChange={() => toggleSelection(cat, setSelectedCategories, selectedCategories)}
//             />
//             {cat}
//           </label>
//         ))}
//       </div>

//       <div className="filter-group">
//         <h4 style={{color:"skyblue",fontSize:"27px",padding:"9px",fontWeight:"900"}}>Location</h4>
//         {locations.map(loc => (
//           <label key={loc}>
//             <input
//               type="checkbox"
//               value={loc}
//               checked={selectedLocations.includes(loc)}
//               onChange={() => toggleSelection(loc, setSelectedLocations, selectedLocations)}
//             />
//             {loc}
//           </label>
//         ))}
//       </div>
//       </>
//         )}
//     </aside>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "../find_freelancer/Sidebar.css";

export function Jobsidebar({ onFilterChange }) {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Company names shown as checkboxes
  const companies = [
    "Google",
    "Flipkart",
    "Amazon",
    "EY",
    "Tata",
    "Microsoft",
    "Apple",
    "Tesla",
    "Meta",
  ];

  const locations = ["Bangalore", "Mumbai", "Hyderabad", "Delhi"];

  /* -------------------------------  responsive toggle  ------------------------------ */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowFilters(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ----------  notify parent (normalised strings => lower‑case, trimmed)  ---------- */
  useEffect(() => {
    onFilterChange({
      companies: selectedCompanies.map((c) => c.toLowerCase().trim()),
      locations: selectedLocations.map((l) => l.toLowerCase().trim()),
    });
  }, [selectedCompanies, selectedLocations, onFilterChange]);

  const toggleSelection = (value, setter, state) => {
    setter(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
  };

  return (
    <div className="side">
      <aside className="sidebar">
        {isMobile && (
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        )}

        {(!isMobile || showFilters) && (
          <>
            <h3>Filter By</h3>

            {/* Company Filter */}
            <div className="filter-group">
              <h4 className="filter-heading">Company</h4>
              {companies.map((co) => (
                <label key={co}>
                  <input
                    type="checkbox"
                    value={co}
                    checked={selectedCompanies.includes(co)}
                    onChange={() => toggleSelection(co, setSelectedCompanies, selectedCompanies)}
                  />
                  {co}
                </label>
              ))}
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <h4 className="filter-heading">Location</h4>
              {locations.map((loc) => (
                <label key={loc}>
                  <input
                    type="checkbox"
                    value={loc}
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleSelection(loc, setSelectedLocations, selectedLocations)}
                  />
                  {loc}
                </label>
              ))}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
