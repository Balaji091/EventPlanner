import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import EventCard from "../EventCard";
import Options from "../Options";
import "./index.css";

const API_URLS = {
  all: "http://localhost:5001/home/all-events",
  upcoming: "http://localhost:5001/home/upcoming-events",
  live: "http://localhost:5001/home/ongoing-events",
  past: "http://localhost:5001/home/completed-events",
};

const EventCardList = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = API_URLS[filter];

        if (selectedDate) {
          url += `?date=${selectedDate}`; // Append date filter to API URL
        }

        const response = await axios.get(url);
        setEvents(response.data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    };

    fetchEvents();
  }, [filter, selectedDate]);

  return (
    <div className="event-dashboard">
      <Options
        setFilter={setFilter}
        API_URLS={API_URLS}
        activeFilter={filter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#6a0dad"} loading={loading} />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : events.length === 0 ? (
        <div className="no-events">No events found</div>
      ) : (
        <div className="event-card-list">
          {events.map((event) => (
            <EventCard key={event._id} event={event} filter = {filter}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCardList;
