import jwt from "jsonwebtoken"

const verifyUserToken = (req, res, next) => {
    const token = req.cookies.User_token || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.USER_TOKEN, (err, decoded) => {
        if (err) {
            console.log('Invalid Token:', token);
            return res.status(500).send({ message: 'Failed to authenticate token.' });
        }

        req.user_id = decoded._id;
        next();
    });
};

export default verifyUserToken