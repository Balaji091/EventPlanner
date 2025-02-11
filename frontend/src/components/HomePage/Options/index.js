import React from "react";
import "./index.css";

const Options = ({ setFilter, activeFilter, API_URLS, selectedDate, setSelectedDate }) => {
  return (
    <div className="options-wrapper">
      <ul className="options-container">
        {Object.keys(API_URLS).map((key) => (
          <li
            key={key}
            className={`option ${activeFilter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </li>
        ))}
      </ul>
      {/* Date Filter */}
      <input
        type="date"
        className="date-picker"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
  );
};

export default Options;
