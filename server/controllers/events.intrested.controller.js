import mongoose from "mongoose";
import Event from "../modals/event.modal.js";
import User from "../modals/user.modal.js";

// ✅ Store Interested Event (Mark as Interested)
export const markInterested = async (req, res) => {
  try {
    const user_id = new mongoose.Types.ObjectId(req.user_id); // Get user ID from token
    const event_id = new mongoose.Types.ObjectId(req.params.event_id); // Get event ID from URL

    // Find user and event
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const event = await Event.findById(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent duplicates
    if (user.events_interested.includes(event_id)) {
      return res.status(400).json({ message: "Already marked as interested" });
    }

    // Add event to user's interested list
    user.events_interested.push(event_id);

    // Add user to event's interested list
    event.interested.push(user_id);

    // Increase event interest count
    event.count += 1;

    // Save updates
    await user.save();
    await event.save();

    res.status(200).json({ message: "Event marked as interested successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Unmark an event as Interested
export const unmarkInterested = async (req, res) => {
    try {
      const user_id = new mongoose.Types.ObjectId(req.user_id);
      const event_id = new mongoose.Types.ObjectId(req.params.event_id);
  
      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const event = await Event.findById(event_id);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      // Remove event from user's interested list
      user.events_interested = user.events_interested.filter(
        (id) => id.toString() !== event_id.toString()
      );
  
      // Remove user from event's interested list
      event.interested = event.interested.filter(
        (id) => id.toString() !== user_id.toString()
      );
  
      // Decrease interest count
      event.count -= 1;
  
      await user.save();
      await event.save();
  
      res.status(200).json({ message: "Event unmarked as interested" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// ✅ Get All Interested Events by Authenticated User
export const getInterestedEvents = async (req, res) => {
  try {
    const user_id = new mongoose.Types.ObjectId(req.user_id); // Get user ID from token

    // Find user and populate their interested events
    const user = await User.findById(user_id).populate("events_interested");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "These are your interested events", events: user.events_interested });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
