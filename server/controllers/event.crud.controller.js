  import Event from "../modals/event.modal.js";
  import mongoose  from "mongoose";

  export const registerEvent = async (req, res) => {
    try {
      const { name, date, time, venue, description } = req.body;
      const image = req.image_url; // Assuming middleware uploads image and sets req.image_url
      const user_id = req.user_id 
      if (!name || !date || !time || !venue || !description || !image) {
        return res.status(400).json({ message: "All mandatory fields are required." });
      }

      const newEvent = new Event({
        user_id,
        name,
        date,
        time,
        venue,
        description,
        image,
        status: "Upcoming", // Default status
      });

      await newEvent.save();

      res.status(201).json({ message: "Event registered successfully.", event: newEvent });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  export const deleteEvent = async (req, res) => {
    try {
      const { event_id } = req.params;
      const userId = req.user_id; // Middleware verified user
      
      const event_owner = await Event.findById(event_id).select("user_id");
      if (!event_owner) {
        return res.status(404).json({ message: "Event not found." });
      }    
      if (event_owner.user_id.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized: You are not the owner of this event." });
      }
      await Event.findByIdAndDelete(event_id);
      res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  export const updateEvent = async (req, res) => {
    try {
      const { event_id } = req.params;
      const userId = req.user_id; // Get the logged-in user's ID
      let updateData = { ...req.body };
  
      // If an image is uploaded, add it to updateData
      if (req.image_url) {
        updateData.image = req.image_url;
      }
  
      // Find the event by ID (Only select user_id to check ownership)
      const event_owner = await Event.findById(event_id).select("user_id").lean();
      
      if (!event_owner) {
        return res.status(404).json({ message: "Event not found." });
      }
  
      // Check if the logged-in user is the owner of the event
      if (event_owner.user_id.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized: You are not the owner of this event." });
      }
  
      // Update the event
      const updatedEvent = await Event.findByIdAndUpdate(
        event_id, 
        updateData, 
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ message: "Event updated successfully.", event: updatedEvent });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  ;

  export const EventDetails = async (req, res) => {
    try {
      const { event_id } = req.params;
      const userId = req.user_id;

      // ✅ Check if event_id is provided BEFORE querying the database
      if (!event_id) {
        return res.status(400).json({ message: "Event ID must be provided as a parameter." });
      }

      // ✅ Fetch the event and owner in a single query
      const event = await Event.findById(event_id).select("-__v"); // Exclude unwanted fields

      // ✅ Check if event exists
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
  
      // ✅ Authorization check AFTER event existence is confirmed
      if (event.user_id.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized: You are not the owner of this event." });
      }

      res.status(200).json({ message: "Event details fetched successfully.", event });
    } catch (error) {
      console.error("Error fetching event details:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    } 
  };
