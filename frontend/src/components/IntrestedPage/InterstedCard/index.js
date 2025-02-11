import React from "react";
import { MdLocationOn } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.css";

const InterestedEventCard = ({ event, onRemove }) => {
  const { name, date, time, venue, image, _id } = event;
  const navigate = useNavigate();

  const handleRemove = async () => {
    try {
      await onRemove(_id);
      toast.success("Successfully removed interest in the event.");
    } catch (error) {
      toast.error("Failed to remove interest. Please try again.");
    }
  };

  return (
    <div className="interested-card-container">
      <img
        src={image}
        alt={name}
        className="interested-card-image"
        onClick={() => navigate(`/events/${_id}`)}
      />
      <div className="interested-card-content">
        <h2 className="interested-card-title">{name}</h2>
        <p className="interested-card-date">
          {new Date(date).toDateString()} | {time}
        </p>
        <div className="interested-card-location">
          <MdLocationOn className="interested-card-icon" />
          <p className="interested-card-venue">{venue}</p>
        </div>
      </div>
      <button className="remove-btn" onClick={handleRemove}>
        <AiFillCloseCircle className="remove-icon" /> Unmark Interest
      </button>
    </div>
  );
};

export default InterestedEventCard;
