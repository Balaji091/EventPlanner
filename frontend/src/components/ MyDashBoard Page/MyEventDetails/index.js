import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "./index.css";
import Header from "../../Header";

const EventDetails = () => {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/event/details/${event_id}`,
          { withCredentials: true }
        );
        const eventData = response.data.event;

        // Convert date to calendar format (YYYY-MM-DD)
        if (eventData.date) {
          eventData.date = new Date(eventData.date).toISOString().split("T")[0];
        }

        setEvent(eventData);
      } catch (error) {
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [event_id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setEvent((prev) => ({ ...prev, [name]: files[0] })); // Store file object
    } else {
      setEvent((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", event.name);
      formData.append("description", event.description);
      formData.append("date", event.date);
      formData.append("time", event.time);
      formData.append("venue", event.venue);
      if (event.image) {
        formData.append("image", event.image); // Append image file
      }
  
      await axios.put(
        `${process.env.REACT_APP_API_URL}/event/update/${event_id}`,
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      toast.success("Event updated successfully");
    } catch (error) {
      toast.error("Error updating event");
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/event/delete/${event_id}`,
        { withCredentials: true }
      );
      toast.success("Event deleted successfully");
      navigate("/myevent-dashboard");
    } catch (error) {
      toast.error("Error deleting event");
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <ClipLoader size={50} color={"#6a0dad"} loading={loading} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="event-details-container">
        <div className="left-section">
          <form className="form-container">
            <div className="form-group">
              <label>Event Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={event?.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                name="description"
                rows="3"
                value={event?.description || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className="form-input"
                name="date"
                value={event?.date || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                className="form-input"
                name="time"
                value={event?.time || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Venue</label>
              <input
                className="form-input"
                type="text"
                name="venue"
                value={event?.venue || ""}
                onChange={handleInputChange}
                required
              />
            </div>
              <div className="form-group">
                  <label>Image</label>
                  <input
                    className="form-input"
                    type="file"
                    name="image"
                    onChange={handleInputChange} // Calls the modified function
                    accept="image/*"
                   />
              </div>

            <div className="form-buttons">
              <Button variant="warning" onClick={handleUpdate}>
                <MdEdit /> Update
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <MdDelete /> Delete
              </Button>
            </div>
          </form>
        </div>
        <div className="right-section">
          <div className="interested-section">
          <h2 className="page-title">Interested Users</h2>
          <p className="interested-count">
            <FaUser /> {event?.interested?.length || 0} 
          </p>
          </div>
          <ul className="interested-list">
            {event?.interested?.length > 0 ? (
              event.interested.map((user, index) => (
                <li key={index} className="user-item">
                  {user}
                </li>
              ))
            ) : (
              <p>No users interested yet.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
