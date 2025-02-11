import express from "express";
import verifyUserToken from "../middleware/auth.user.verify.js"
import { markInterested, getInterestedEvents, unmarkInterested } from "../controllers/events.intrested.controller.js";

const InterestedRouter = express.Router();

// ✅ Mark an event as interested
InterestedRouter.post("/:event_id", verifyUserToken, markInterested);
InterestedRouter.delete("/:event_id", verifyUserToken, unmarkInterested);
// ✅ Get all interested events of a user
InterestedRouter.get("/interested-events", verifyUserToken, getInterestedEvents);

export default InterestedRouter;
