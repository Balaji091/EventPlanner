import mongoose from "mongoose";
import { type } from "os";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  events_interested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // References Event model
    },
  ],
  notifications : [
    {
        message : {
          type : String,
          required : true
        },
        read : {
          type : Boolean,
          default : false
        }
    }
  ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User
