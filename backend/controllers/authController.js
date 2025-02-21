import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
 try {
    let user = await User.findOne({ email });
    if (user) 
      return res.status(400).json({ message: "User already exists" });
    user = new User({name,email,password});
    await user.save();
 
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, 
      { expiresIn: '1h' } );
     res.json({ token }); 
    } catch (error) {
    res.status(500).json({ message: "Server error" }); 
  }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
      const token = jwt.sign({ userId: user.id },process.env.JWT_SECRET, 
        { expiresIn: '1h' } );
    res.json({ token }); 
    } catch (error) {
      res.status(500).json({ message: "Server error" }); 
    }
  };