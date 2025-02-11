import { Server } from "socket.io";

// Use two Maps for better performance and clarity
const uniqueUsersMap = new Map(); // Tracks unique users per room
const concurrentUsersMap = new Map(); // Tracks concurrent users per room

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", ({ event_id, user_id }) => {
      socket.join(event_id);
      console.log(`User ${user_id} joined room ${event_id}`);

      // Initialize Maps for the room if they don't exist
      if (!uniqueUsersMap.has(event_id)) {
        uniqueUsersMap.set(event_id, new Set());
      }
      if (!concurrentUsersMap.has(event_id)) {
        concurrentUsersMap.set(event_id, new Set());
      }

      // Track unique users
      uniqueUsersMap.get(event_id).add(user_id);

      // Track concurrent users
      concurrentUsersMap.get(event_id).add(user_id);
      socket.data.user_id = user_id
      // Emit room stats to all users in the room
      io.to(event_id).emit("room-stats", {
        concurrentUsers: concurrentUsersMap.get(event_id).size,
        uniqueViews: uniqueUsersMap.get(event_id).size,
      });
      // Track the room the user joined
      socket.data.room = event_id;
    });

    socket.on("live-event-end", (event_id) => {
      io.to(event_id).emit("live-event-end");
    });

    socket.on("room-start", (interestedUserIds) => {
      console.log("Room Start Triggered. Notifying users...");

      if (interestedUserIds && Array.isArray(interestedUserIds)) {
        interestedUserIds.forEach((user_id) => {
          console.log(`Sending notification to user: ${user_id}`);
          io.to(user_id).emit("notification-in", { message: "Event has started!" });
        });
      }
    });

    socket.on("join-notification", (user_id) => {
      socket.join(user_id);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      const event_id = socket.data.room; // Get the room the user was in
      console.log("nanianifnidfnidf   "+event_id)
      if (event_id && concurrentUsersMap.has(event_id)) {
        const user_id = socket.data.user_id; // Assuming you store user_id in socket.data

        // Remove the user from concurrent users
        concurrentUsersMap.get(event_id).delete(user_id);

        // Emit updated room stats
        io.to(event_id).emit("room-stats", {
          concurrentUsers: concurrentUsersMap.get(event_id).size,
          uniqueViews: uniqueUsersMap.get(event_id).size,
        });

        // Clean up the room if no users are left
        if (concurrentUsersMap.get(event_id).size === 0) {
          concurrentUsersMap.delete(event_id);
          uniqueUsersMap.delete(event_id);
        }
      }
    });
  });
};

export default setupSocket;