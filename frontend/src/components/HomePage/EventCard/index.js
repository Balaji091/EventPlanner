import React from "react";
import { MdLocationOn } from "react-icons/md";
import "./index.css";
import {useNavigate} from 'react-router-dom'
const EventCard = ({ event ,filter}) => {
  const { name, date, time, venue, image ,_id} = event;
  const navigate=useNavigate()

  return (
    <div className="event-card-container" onClick={()=>(filter !=="live" )?navigate(`/events/${_id}`):navigate(`/live-event/${_id}`)}>
      <img src={image} alt={name} className="event-card-image" />
      <div className="event-card-content">
        <h2 className="event-card-title">{name}</h2>
        <p className="event-card-date">{new Date(date).toDateString()} | {time}</p>
        <div className="event-card-location">
          <MdLocationOn className="event-card-icon" />
          <p className="event-card-venue">{venue}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
