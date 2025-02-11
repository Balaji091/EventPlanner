import React, { useEffect, useState } from "react";
import Header from "../../Header"; // Include your Header component
import InterestedEventCard from "../InterstedCard"; // Using InterestedEventCard
import "./index.css"; // Import CSS

const InterestedEvents = () => {
  const [events, setEvents] = useState([]);

  // Fetch interested events from API
  useEffect(() => {
    const fetchInterestedEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favoured/interested-events`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchInterestedEvents();
  }, []);

  // Function to unmark interest
  const handleUnmarkInterest = async (eventId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/favoured/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to unmark event");

      setEvents(events.filter(event => event._id !== eventId)); // Remove event from UI
    } catch (error) {
      console.error("Error unmarking event:", error);
    }
  };

  return (
    <div className="interested-events-container">
      <Header  /> {/* Include the header */}
      <h2 className="title">Interested Events</h2>
      <div className="events-grid">
        {events.length > 0 ? (
          events.map(event => (
            <InterestedEventCard key={event._id} event={event} onRemove={handleUnmarkInterest} />
          ))
        ) : (
          <p className="no-events">No interested events found.</p>
        )}
      </div>
    </div>
  );
};

export default InterestedEvents;
