import express from "express";
import { getUnreadNotificationsCount, getAllNotifications,sendNotification ,markAllAsRead} from "../controllers/notifications.controller.js";
import verifyUserToken from "../middleware/auth.user.verify.js"

const NotificationRouter = express.Router();

NotificationRouter.get("/users/unread-count", verifyUserToken,getUnreadNotificationsCount);
NotificationRouter.get("/users/notifications", verifyUserToken,getAllNotifications);
NotificationRouter.post("/send/:event_id", verifyUserToken,sendNotification);
NotificationRouter.get("/read", verifyUserToken,markAllAsRead);

export default NotificationRouter;
