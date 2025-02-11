import Event from "../modals/event.modal.js";
import mongoose  from "mongoose";

export const getCompletedEvents = async (req, res) => {
  try {
    const { date } = req.query;
    const user_id = new mongoose.Types.ObjectId(req.user_id);
    let query = { status: "Completed", user_id  };

    if (date) {
      const providedDate = new Date(date);
      query.date = providedDate;
    }

    const completedEvents = await Event.find(query);
    res.status(200).json({events:completedEvents});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getOngoingEvents = async (req, res) => {
  try {
    const { date } = req.query;
    const currentDateTime = new Date();
    const user_id = new mongoose.Types.ObjectId(req.user_id);

    let query = { status: { $ne: "Completed" }, user_id };

    if (date) {
      query.date = new Date(date);
    }

    const events = await Event.find(query);

    const ongoingEvents = events.filter(event => {
      const eventStartDateTime = new Date(event.date);

      if (event.time) {
        const [hours, minutes, seconds] = event.time.split(":").map(Number);
        eventStartDateTime.setHours(hours || 0, minutes || 0, seconds || 0);
      }

      // Assume events end at 23:59:59 on the same day unless a duration is provided
      const eventEndDateTime = new Date(eventStartDateTime);
      eventEndDateTime.setHours(23, 59, 59);

      return currentDateTime >= eventStartDateTime && currentDateTime <= eventEndDateTime;
    });

    res.status(200).json({ events: ongoingEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


  export const getUpcomingEvents = async (req, res) => {
    try {
      const { date } = req.query;
      const currentDateTime = new Date();
      const user_id = new mongoose.Types.ObjectId(req.user_id);
  
      let query = { status: { $ne: "Completed" }, user_id };
  
      if (date) {
        query.date = new Date(date);
      }
  
      const events = await Event.find(query);
  
      const upcomingEvents = events.filter(event => {
        const eventStartDateTime = new Date(event.date);
  
        if (event.time) {
          const [hours, minutes, seconds] = event.time.split(":").map(Number);
          eventStartDateTime.setHours(hours || 0, minutes || 0, seconds || 0);
        }
  
        return currentDateTime < eventStartDateTime;
      });
  
      res.status(200).json({ events: upcomingEvents });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

export const AllEvents = async (req, res) => {
  try {
    const user_id = new mongoose.Types.ObjectId(req.user_id);
    const events = await Event.find({user_id })    
    res.status(200).json({ message: "These are your events", events });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}; 