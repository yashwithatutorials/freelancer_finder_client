import { useState } from "react";
import "../find_freelancer/TopSearch.css";

export default function Jobsearch({ onSearch }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(text.trim());
  }

  return (
    <header className="topbar" style={{paddingTop:"20px"}}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search job name…"
          value={text}
         onChange={e => {
   const val = e.target.value;
   setText(val);
   onSearch(val.trim());   
 }} style={{color:"white"}} />
        <button type="submit">Search</button>
      </form>
    </header>
  );
}