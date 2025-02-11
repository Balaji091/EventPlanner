import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  user_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref :"User",
    required : true
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed"], // Event status
    default: "Upcoming",
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store URL of the image (Cloudinary, etc.)
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  interested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References User model
    },
  ],
  count: {
    type: Number,
    default: 0,
  },
  event_data: {
    type: mongoose.Schema.Types.Mixed, // Can store additional dynamic data
  },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event
