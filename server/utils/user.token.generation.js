import jwt from "jsonwebtoken"

const generateUserToken = (res, _id) => {
    const token = jwt.sign({ _id }, process.env.USER_TOKEN, { expiresIn: "3d" });

    res.cookie("User_token", token, {
        httpOnly: true, 
        sameSite: "None", 
        secure: true, 
        path: "/",
        maxAge: 3 * 24 * 60 * 60 * 1000 
    });

    return token;
};
export default generateUserToken