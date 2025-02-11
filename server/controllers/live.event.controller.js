import Event from "../modals/event.modal.js";

// ✅ GET COMPLETED EVENTS
// ✅ GET COMPLETED EVENTS
export const verifyOwner = async (req, res) => {
  try {
    const user_id = req.user_id; // This should come from your request (authenticated user)
    const { event_id } = req.params;

    // Find the event by its ID and select the user_id (owner) field
    const event = await Event.findById(event_id).select("user_id");

    // If no event is found, send an error response
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const owner_id = event.user_id; // Extract the owner user_id from the event

    // Compare the user_id from the event with the user_id from the request
    if (String(owner_id) === String(user_id)) {
      res.status(200).json({ success: true, message: "You are the owner" });
    } else {
      res.status(400).json({ success: false, message: "You are not the owner" });
    }
  } catch (error) {
    console.error("Error verifying owner:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const startEvent = async (req, res) => {
  try {
    const user_id = req.user_id; // This should come from your request (authenticated user)
    const { event_id } = req.params;

    // Find the event by its ID and select the user_id (owner) field
    const event = await Event.findById(event_id).select("user_id status");

    // If no event is found, send an error response
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const owner_id = event.user_id; // Extract the owner user_id from the event


    // Compare the user_id from the event with the user_id from the request
    if (String(owner_id) === String(user_id)) {
      event.status = "Ongoing"
      await event.save()
      res.status(200).json({ success: true, message: "Event started" });
    } else {
      res.status(400).json({ success: false, message: "You are not the owner" });
    }
  } catch (error) {
    console.error("Error verifying owner:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const endEvent = async (req, res) => {
  try {
    const user_id = req.user_id; // This should come from your request (authenticated user)
    const { event_id } = req.params;
    const {uniq_viewers} = req.body
    // Find the event by its ID and select the user_id (owner) field
    const event = await Event.findById(event_id).select("user_id status count");

    // If no event is found, send an error response
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const owner_id = event.user_id; // Extract the owner user_id from the event

    console.log("Owner ID:", owner_id);
    console.log("User ID:", user_id);

    // Compare the user_id from the event with the user_id from the request
    if (String(owner_id) === String(user_id)) {
      event.status = "Completed"
      event.count = uniq_viewers
      await event.save()
      res.status(200).json({ success: true, message: "Event ended succesfully" });
    } else {
      res.status(400).json({ success: false, message: "You are not the owner" });
    }
  } catch (error) {
    console.error("Error verifying owner:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};