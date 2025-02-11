import express from "express";
import { getCompletedEvents, getOngoingEvents, getUpcomingEvents,AllEvents,EventDetails  } from "../controllers/home.controller.js";

const HomeRouter = express.Router();

HomeRouter.get("/completed-events", getCompletedEvents);
HomeRouter.get("/ongoing-events", getOngoingEvents);
HomeRouter.get("/upcoming-events", getUpcomingEvents);
HomeRouter.get("/all-events", AllEvents);
HomeRouter.get("/events/:event_id", EventDetails);

export default HomeRouter;
