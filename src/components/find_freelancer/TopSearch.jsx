import { useState } from "react";
import "./TopSearch.css";

export default function TopSearch({ onSearch }) {
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
          placeholder="Search freelancer name…"
          value={text}
          onChange={(e) => setText(e.target.value)}
       style={{color:"white"}} />
        <button type="submit">Search</button>
      </form>
    </header>
  );
}