import express from "express"
import {registerEvent,deleteEvent,updateEvent,EventDetails} from "../controllers/event.crud.controller.js"
import verifyUserToken from "../middleware/auth.user.verify.js"
import {uploadSingle,uploadImage} from "../middleware/uploadMiddleware.js"
import { updateEventImage,uploadOptional } from "../middleware/update.middleware.js"
import multer from "multer"


const EventRouter = express.Router()

EventRouter.post("/register",verifyUserToken,uploadSingle,uploadImage,registerEvent)
EventRouter.delete("/delete/:event_id",verifyUserToken,deleteEvent)
EventRouter.put("/update/:event_id",verifyUserToken,uploadOptional,updateEventImage,updateEvent)

EventRouter.get("/details/:event_id",verifyUserToken,EventDetails)

export default EventRouter