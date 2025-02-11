import { useEffect, useState } from "react";
import socket from "../../socket/connection";
import {  useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header";
import { toast } from "react-toastify";
import axios from "axios";

export default function LiveRoom() {
  const { event_id } = useParams();  

  const [event, setEvent] = useState(null);
  const [isOwner,setIsOwner] = useState(false)
  const [concurrentUsers, setConcurrentUsers] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);

  const navigate = useNavigate()

  useEffect(() => {
    socket.connect();
    socket.emit("join-room", {
      event_id,
      user_id: Cookies.get("authenticated") || localStorage.getItem("guest_id"),
    });
  
    socket.on("room-stats", (msg) => {
      setConcurrentUsers(msg.concurrentUsers);
      setUniqueViews(msg.uniqueViews);
    });
  
    socket.on("live-event-end", () => {
      toast.success(`Event Ended Successfully`);
      setTimeout(() => navigate("/"), 1500);
    });
  
    return () => {
      // Only disconnect if connected
      if (socket.connected) {
        socket.off("room-stats");
        socket.off("live-event-end");
        socket.disconnect();
      }
    };
  }, [event_id, navigate]);

  
  useEffect(() => {
    // Define an async function inside the useEffect
    const verifyOwner = async () => {
      try {
        // Await the axios request to resolve
        const res = await axios.get(`http://localhost:5001/live-event/verify-owner/${event_id}`, { withCredentials: true });

        // Check the response status and handle it accordingly
        if (res.status === 200) {
          setIsOwner(true);
        } 
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error verifying owner:", error);
      }
    };

    // Call the async function
    verifyOwner();
  }, [event_id]); // Add event_id to the dependency array


  useEffect(() => {
    fetchEventDetails();
  }, [event_id]);
  

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/home/events/${event_id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setEvent(data.event);
      console.log(data.event)
    } catch (err) {
      console.log(err)
    } 
  };

  const handleStart = async () => {
    try {
      const [istarted, send_notifications] = await Promise.all([
        axios.get(`http://localhost:5001/live-event/start-event/${event_id}`, { withCredentials: true }),
        axios.post(
          `http://localhost:5001/notifications/send/${event_id}`,
          { message: `${event.name} is started. Go watch live.` },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        )
      ]);
  
      if (istarted.status === 200 && send_notifications.status === 200) {
        socket.emit("room-start", event.interested);
        fetchEventDetails()
      } else {
        toast.error("Failed to start the event");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnd = async () => {
    try {
      const response = await axios.post(
      `http://localhost:5001/live-event/end-event/${event_id}`,
      { uniq_viewers: uniqueViews}, // Adding the body
      { withCredentials: true } // Ensuring credentials are included
    );
    
  
      if (response.status === 200) {
        socket.emit("live-event-end",event_id);
      } else {
        toast.error("Failed to end the event");
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  return (
    <div className="flex flex-col items-center p-4">
      <Header />
      <h1 className="text-2xl font-bold my-4">Live Event</h1>

      <div className="relative w-80 h-48 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
        <img
          src="https://media.giphy.com/media/hTg5QpRJItpFUw37jw/giphy.gif"
          alt="Live Streaming"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="text-center mt-4">
        <p className="text-lg font-semibold">Concurrent Users: {concurrentUsers}</p>
        <p className="text-lg font-semibold">Unique Views: {uniqueViews}</p>
      </div>
      {isOwner &&
        <div className="mt-6 flex gap-4">
          {(event && event.status === "Upcoming")?
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            onClick={handleStart}>
            Start Event
          </button>:          
          <button onClick={handleEnd}
           className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
            End Event
          </button>
          }
        </div>
       }
      </div>

  );
}
