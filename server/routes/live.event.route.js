import express from "express"
import {  verifyOwner,startEvent,endEvent} from "../controllers/live.event.controller.js"
import verifyUserToken from "../middleware/auth.user.verify.js"

const LiveEventRouter = express.Router()


LiveEventRouter.get("/verify-owner/:event_id",verifyUserToken, verifyOwner)
LiveEventRouter.get("/start-event/:event_id",verifyUserToken, startEvent)
LiveEventRouter.post("/end-event/:event_id",verifyUserToken, endEvent)

export default LiveEventRouter