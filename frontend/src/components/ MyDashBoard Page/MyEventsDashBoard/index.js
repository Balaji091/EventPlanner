import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Header from "../../Header";
import MyEventCard from "../MyEventCard";
import "./index.css";
import ClipLoader from "react-spinners/ClipLoader";
export default function EventEDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let endpoint = `${process.env.REACT_APP_API_URL}/dashboard/all-events`;
        if (activeTab === "Live") endpoint = `${process.env.REACT_APP_API_URL}/dashboard/ongoing-events`;
        if (activeTab === "Completed") endpoint = `${process.env.REACT_APP_API_URL}/dashboard/completed-events`;
        if (activeTab === "Upcoming") endpoint =  `${process.env.REACT_APP_API_URL}/dashboard/upcoming-events`;

        const response = await fetch(endpoint, { credentials: "include" });
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [activeTab]);

  return (
    <div className="dashboard-container">
      <Header  />
      <div className="dashboard-content">
        {/* Top Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Events</h1>
          <button
            onClick={() => navigate("/add-event")}
            className="add-event-btn"
          >
            <FaPlus className="icon" />
            <span className="add-btn-text">Add Event</span>
          </button>
        </div>

        {/* Options Tabs */}
        <div className="tabs">
          <ul className="tab-list">
            {["All", "Live", "Completed", "Upcoming"].map((tab) => (
              <li
                key={tab}
                className={`tab-item ${activeTab === tab ? "active-link" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Events List */}
        <div className="my-event-list">
          {loading ? (
            <div className="spinner-container">
            <ClipLoader size={50} color={"#6a0dad"} loading={loading} />
          </div>
          ) : events.length > 0 ? (
            events.map((event) => <MyEventCard key={event._id} event={event} onClick={()=>{navigate('/my-events/:event._id')}} />)
          ) : (
            <p className="no-events">No events found</p>
          )}
        </div>
      </div>
    </div>
  );
}
