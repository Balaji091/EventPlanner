import User from "../modals/user.modal.js"; // Adjust the path as needed
import Event from "../modals/event.modal.js";

// Get count of unread notifications
export const getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId  = req.user_id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const unreadCount = user.notifications.filter(n => !n.read).length;
    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const userId  = req.user_id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const sendNotification = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Find the event and get interested users
        const event = await Event.findById(event_id).populate("interested");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const interestedUsers = event.interested;

        if (interestedUsers.length === 0) {
            return res.status(200).json({ message: "No interested users for this event" });
        }

        // Update notifications for each interested user
        await Promise.all(
            interestedUsers.map(async (user) => {
                await User.findByIdAndUpdate(user._id, {
                    $push: { notifications: { message, read: false } }
                });
            })
        );

        res.status(200).json({ message: "Notification sent to all interested users" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user_id; // Extract user ID from request attributes
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update all unread notifications to read
    user.notifications.forEach(notification => {
      notification.read = true;
    });
    await user.save();

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
