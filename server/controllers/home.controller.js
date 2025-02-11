import Event from "../modals/event.modal.js";

// ✅ GET COMPLETED EVENTS
export const getCompletedEvents = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { status: "Completed" };

    if (date) {
      query.date = new Date(date);
    }

    const completedEvents = await Event.find(query);
    res.status(200).json({ events: completedEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET ONGOING EVENTS
export const getOngoingEvents = async (req, res) => {
  try {
    const { date } = req.query;
    const currentDateTime = new Date(); // Get current time in UTC

    let query = { status: { $ne: "Completed" } };
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

      return eventStartDateTime <= currentDateTime;
    });

    res.status(200).json({ events: ongoingEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ GET UPCOMING EVENTS
export const getUpcomingEvents = async (req, res) => {
  try {
    const { date } = req.query;
    const currentDateTime = new Date(); // Get current time in UTC

    let query = { status: { $ne: "Completed" } };
    if (date) {
      query.date = new Date(date);
    }

    const events = await Event.find(query);
    // console.log("hi upcoming");

    const upcomingEvents = events.filter(event => {
      const eventDateTime = new Date(event.date); // Convert event date to Date object

      if (event.time) {
        // console.log(`Original Date: ${event.date}, Time: ${event.time}`);
        const [hours, minutes, seconds] = event.time.split(":").map(Number);
        eventDateTime.setUTCHours(hours || 0, minutes || 0, seconds || 0); // Ensure UTC consistency
      }

      // console.log(`Computed Event DateTime: ${eventDateTime}`);
      return eventDateTime > currentDateTime;
    });

    res.status(200).json({ events: upcomingEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ GET ALL EVENTS
export const AllEvents = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      query.date = new Date(date);
    }

    const events = await Event.find(query);
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET EVENT DETAILS
export const EventDetails = async (req, res) => {
  try {
    const { event_id } = req.params;
    if (!event_id) {
      return res.status(400).json({ message: "Event ID should be passed as params" });
    }
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event details fetched successfully.", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
