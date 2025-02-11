import express from "express"
import { login,signup,logout, getUserDetails } from "../controllers/auth.user.controller.js"
import verifyUserToken from "../middleware/auth.user.verify.js"

const AuthRouter = express.Router()

AuthRouter.post("/login", login)
AuthRouter.post("/signup", signup)
AuthRouter.get("/logout", logout)
AuthRouter.get("/user",verifyUserToken, getUserDetails)

AuthRouter.get("/verify", verifyUserToken, (req, res) => {
    res.status(200).json({ success: true, message: "User isverified"})
})

export default AuthRouter