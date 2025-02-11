import React from "react";
import { MdLocationOn } from "react-icons/md";
import "./index.css";
import {useNavigate} from 'react-router-dom'
const MyEventCard = ({ event }) => {
  const { name, date, time, venue, image ,_id} = event;
  const navigate=useNavigate()

  return (
    <div className="my-event-card-container" onClick={()=>navigate(`/my-events/${_id}`)}>
      <img src={image} alt={name} className="my-event-card-image" />
      <div className="my-event-card-content">
        <h2 className="my-event-card-title">{name}</h2>
        <p className="my-event-card-date">{new Date(date).toDateString()} | {time}</p>
        <div className="my-event-card-location">
          <MdLocationOn className="my-event-card-icon" />
          <p className="my-event-card-venue">{venue}</p>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;
