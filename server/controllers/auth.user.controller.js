import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../modals/user.modal.js"
import generateUserToken from "../utils/user.token.generation.js"

// Login API
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token and set it as a cookie
        generateUserToken(res, user._id);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user_id : user._id
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Signup API
const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: 'user already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newuser = new User({
            email,
            password: hashedPassword
        });

        // Save user to the database
        await newuser.save();

        // Generate token and set it as a cookie
        generateUserToken(res, newuser._id);


        res.status(201).json({
            success: true,
            message: "user registered successfully",
            user_id : newuser._id
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Logout API
const logout = (req, res) => {
    res.cookie('User_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Set the cookie to expire immediately
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user_id).select("-password"); // Corrected from req.userId to req.user_id
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ email: user.email, name: user.name });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export { login, signup, logout,getUserDetails };