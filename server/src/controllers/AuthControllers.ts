import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(409)
        .json({ message: "A user with this email already exists." });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error during signup." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(401)
        .json({ message: "User not found. Please check your email." });
      return;
    }

    if (!(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid password. Please try again." });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error during login." });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: "Token is required." });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      res.status(401).json({ message: "Invalid Google token." });
      return;
    }

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(20).toString("hex");

      user = new User({
        email,
        name,
        password: randomPassword,
      });

      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during Google login." });
  }
};
