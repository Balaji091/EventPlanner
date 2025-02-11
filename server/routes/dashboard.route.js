import express from "express";
import { getCompletedEvents, getOngoingEvents, getUpcomingEvents,AllEvents } from "../controllers/dashboard.controller.js";
import verifyUserToken from "../middleware/auth.user.verify.js";
const DashBoardRouter = express.Router();

DashBoardRouter.get("/completed-events",verifyUserToken, getCompletedEvents);
DashBoardRouter.get("/ongoing-events", verifyUserToken,getOngoingEvents);
DashBoardRouter.get("/upcoming-events",verifyUserToken, getUpcomingEvents);
DashBoardRouter.get("/all-events", verifyUserToken,AllEvents);

export default DashBoardRouter;
