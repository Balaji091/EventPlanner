import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../Header";
import "./index.css";
import ClipLoader from "react-spinners/ClipLoader";
export default function AddEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventPic, setEventPic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split("T")[0];
    if (eventDate < today) {
      toast.error("Event date must be today or in the future.");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("name", eventName);
    formData.append("description", eventDescription);
    formData.append("date", eventDate);
    formData.append("time", eventTime);
    formData.append("venue", eventVenue);
    formData.append("image", eventPic);

    try {
      const response = await fetch("http://localhost:5001/event/register", {
        method: "POST",
        body: formData,
        credentials: "include"  
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      toast.success("Event registered successfully!");
      setEventName("");
      setEventDescription("");
      setEventDate("");
      setEventTime("");
      setEventVenue("");
      setEventPic(null);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message || "Failed to register event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-container">
            <ClipLoader size={50} color={"#6a0dad"} loading={loading} />
          </div>
        </div>
      )}
      <div className="container">
        <h2 className="page-title">Add New Event</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input className="form-input" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows="3" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-input" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="time" className="form-input" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input className="form-input" type="text" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Event Picture</label>
            <input type="file" name="image" accept="image/*" onChange={(e) => setEventPic(e.target.files[0])} required />
          </div>
          <button className="register-button" type="submit" disabled={loading}>Register Event</button>
        </form>
      </div>
    </>
  );
}
