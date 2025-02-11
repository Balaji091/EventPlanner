  import React, { useState, useEffect } from "react";
  import { Navigate, useParams } from "react-router-dom";
  import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import Header from "../../Header";
  import ClipLoader from "react-spinners/ClipLoader";
  import "./index.css";
  import { useNavigate } from "react-router-dom";
  const EventCardDetails = () => {
    const { event_id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interested, setInterested] = useState(false);
    const navigate=useNavigate()
    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5001/home/events/${event_id}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setEvent(data.event);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEventDetails();
    }, [event_id]);

    const handleInterestedClick = async () => {
      try {
        const response = await fetch(`http://localhost:5001/favoured/${event_id}`, {
          method: "POST",
          credentials:"include"
        });

        const result = await response.json();
        console.log(result)
        if (response.ok) {
          toast.success(result.message);
          setInterested(true);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error("Something went wrong! Please try again.");
      }
      
    };

    if (loading) {
      return (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#6a0dad"} loading={loading} />
        </div>
      );
    }
    if (error) return <p>Error: {error}</p>;
    if (!event) return <p>No event found</p>;

    return (
      <>
        <Header />
        <div className="event-details-container">
          <div className="event-details-bottom-container">
            <img className="event-details-image" src={event.image} alt={event.name} />
            <div className="event-info-container">
              <h2 className="event-name">{event.name}</h2>
              <p className="event-description">{event.description}</p>
              <div className="event-details-date-time">
                <FaCalendarAlt className="event-icon" />
                <span>{new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <FaClock className="event-icon" />
                <span>{event.time}</span>
              </div>
              <div className="event-details-venue">
                <FaMapMarkerAlt className="event-icon" />
                <span>{event.venue}</span>
              </div>
              <div className="event-actions">
                <button
                  className={`interest-btn ${interested ? "interested" : ""}`}
                  onClick={handleInterestedClick}
                  disabled={interested}
                >
                  {interested ? "Marked as interested " : "Mark as interest"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  export default EventCardDetails;
