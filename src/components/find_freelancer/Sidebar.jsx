import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const categories = [
   'Frontend Developer', 'Backend Developer', 'Full Stack',
  'Data Analyst', 'Graphic Designer', 'Management', 'Tutor',
  'Video Editor', 'Photography', 'Financial Advisor'
];
const locations = [
  'Bangalore', 'Washington', 'Hyderabad',
  'Mumbai', 'California', 'Chennai', 'New York'
];

export default function Sidebar({ onFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowFilters(!mobile); 
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange({
        skills: selectedCategories,
        locations: selectedLocations
      });
    }
  }, [selectedCategories, selectedLocations, onFilterChange]);

  const handleCheckboxChange = (setFn, values, value) => {
    setFn(values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value]);
  };

  return (
    <div className="side">
      <aside className="sidebar">
        {isMobile && (
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        )}

        {(!isMobile || showFilters) && (
          <>
            <h3>Search by Skills</h3>
            <div className="filter-group">
              {categories.map(cat => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCheckboxChange(setSelectedCategories, selectedCategories, cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <h3>Search by Location</h3>
            <div className="filter-group">
              {locations.map(loc => (
                <label key={loc}>
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => handleCheckboxChange(setSelectedLocations, selectedLocations, loc)}
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
