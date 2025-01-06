import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";


const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN, {
        expiresIn: '6h'
    })
}

const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN, {
        expiresIn: '7d'
    })
}

//* REGISTER USER
const registerUser = async (req, res) => {
    //* Destructure user details from the request body
    const { username, email, password } = req.body;

    //* Check if all required fields are provided
    if (!username) return res.status(400).json({ message: "Username is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    //* Check if a user with the same email already exists
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "Email Already Exists" });

    //* Create a new user in the database
    const userCreate = await User.create({
        username,
        email,
        password,
    });

    //* Respond with success message and created user data
    res.status(200).json({
        message: "User created successfully",
        data: userCreate,
    });
};

//* LOGIN USER
const loginUser = async (req, res) => {
    //* Destructure email and password from the request body
    const { email, password } = req.body;

    //* Check if both email and password are provided
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    //* Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "No user Found!" });

    //* Compare the provided password with the hashed password in the database
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) return res.status(404).json({ message: "Password is incorrect!" });

    //* Generate access and refresh tokens for the user
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //* Set the refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, //* Set to true if using HTTPS
        sameSite: "strict", //* Prevent CSRF attacks
    });

    //* Respond with success message, tokens, and user data
    res.status(200).json({
        message: "User Logged In Successfully",
        accessToken,
        refreshToken,
        data: user,
    });
};

//* LOGOUT USER
const logoutUser = async (req, res) => {
    //* Check if the refresh token cookie exists
    if (!req.cookies || !req.cookies.refreshToken) {
        return res.status(400).json({ message: "No active session found" }); //* User already logged out
    }
    //* Clear the refresh token cookie
    res.clearCookie("refreshToken");

    //* Respond with success message
    res.status(200).json({ message: "User Logged Out Successfully" });
};


//* REFRESH-TOKEN
const refreshToken = async (req, res) => {
    //* Get the refresh token from cookies or request body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No Refresh Token Found!" });

    //* Verify the refresh token using the secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    //* Find the user associated with the token
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "Invalid Refresh Token!" });

    //* Generate a new access token for the user
    const generateToken = generateAccessToken(user);

    //* Respond with the new access token
    res.status(200).json({
        message: "Access Token Generated",
        accessToken: generateToken,
    });

    //* (Optional) Send the decoded token data if needed
    res.json({ decoded });
};



export { registerUser, loginUser, logoutUser, refreshToken }