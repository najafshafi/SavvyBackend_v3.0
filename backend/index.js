import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "./models/chat.js";
import cookieParser from 'cookie-parser';
import User from "./models/userChats.js";
import { check, body, validationResult } from 'express-validator';

import scoreRoutes from './routes/scoreRoutes.js';
import quizRoutes from "./routes/quizRoutes.js";
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import postRoutes from './routes/postRoutes.js';
// process.env.JWT_SECRET

const port = 3003;
const host = "https://codesavvyy.netlify.app"
const JWT_SECRET = 'mySuperSecretKey12345!@#$%'
const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: host,
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
};


app.use(cors(corsOptions));

app.use(urlencoded({ extended: true }));

app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/task', taskRoutes);

// mongodb+srv://najafshafee5:<oBjpKpj3ClUDDrbe>@codesavvy-v3.sjoai.mongodb.net/

// const connect = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/Chat");
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.log(err);
//   }
// };


const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://najafshafee5:oBjpKpj3ClUDDrbe@codesavvy-v3.sjoai.mongodb.net");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

// const authenticate = (req, res, next) => {
//   // Get the token from the cookies
//   const token = req.cookies.token;
//   console.log(token)
//   if (!token) {
//     return res.status(401).send('Access denied. No token provided.');
//   }

//   try {
//     // Verify the token using JWT_SECRET
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.auth = { userId: decoded.userId };  // Attach the decoded user ID to the request object
//     next();  // Pass control to the next middleware or route handler
//   } catch (error) {
//     res.status(400).send('Invalid token.');
//   }
// };

const authenticate = (req, res, next) => {
  try {
    // Check if the token is in the Authorization header or cookies
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }

      // If the token is valid, attach the decoded user info to the request object
      req.auth = {
        userId: decoded.userId, // Extract the userId from the decoded token
      };
      next(); // Proceed to the next middleware or route handler
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Register User
// app.post("/api/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!email || !password || !name) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Create new user
//     const newUser = new User({ email, password });
//     newUser.userId = newUser._id;
//     await newUser.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: newUser._id },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Set token in a cookie
//     res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error while signing up" });
//   }
// });


app.post('/api/signup', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    user = new User({ name, email, password });

    // Save the user to the database (password gets hashed automatically via the pre-save hook)
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Set token as an HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    // Send success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
//     res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await user.comparePassword(password);  // Use comparePassword method

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Set token as an HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, path: '/' });

    // Optionally, set user data in cookie (make sure sensitive data is not included)
    res.cookie('user', JSON.stringify({ id: user._id, name: user.name, email: user.email }), {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expiry 1 day
      path: '/',
    });

    // Send success response with token and user info (excluding password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// app.get('/api/verifyToken', async (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.user.id).select('-password');
//     res.json({ user });
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//     console.log("Token is invalid.")
//   }
// });

app.get("/api/verifyToken", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    res.status(200).json({ user: { id: decoded.userId } }); // Return user info
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});



// Get User Data (Protected Route)
app.get("/api/user", authenticate, async (req, res) => {
  const userId = req.auth.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found!");
    }

    res.status(200).send(user);  // Access the user's chat directly
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user!");
  }
});


// Logout User
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');  // Clear the JWT token cookie
  res.status(200).json({ message: 'Logout successful' });
});


// Create Chat Route
app.post("/api/chats", authenticate, async (req, res) => {
  const userId = req.auth.userId;  // userId is extracted from the decoded JWT token in the auth middleware
  const { text } = req.body;

  try {
    // Step 1: Check if the user exists in the User collection
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).send("User not found!");
    }

    // Step 2: Create a new chat entry
    const newChat = new Chat({
      chatId: userId,  // Ensure chatId is set to userId
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // Step 3: Find the user and push the chat to the user's chat array
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          chat: {
            _id: savedChat._id,
            title: text.substring(0, 40),
            createdAt: savedChat.createdAt
          },
        },
      }
    );

    res.status(201).send(savedChat._id);  // Return the newly created chat ID
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});


// Get Chat Route
app.get("/api/chats/:id", authenticate, async (req, res) => {
  const userId = req.auth.userId;  // The userId is from the decoded JWT token

  try {
    // Find the chat where the _id and userId match
    const chat = await Chat.findOne({ _id: req.params.id }); //chatId: userId

    if (!chat) {
      return res.status(404).send("Chat not found");
    }

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});


// Update Chat Route
app.put("/api/chats/:id", authenticate, async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer } = req.body;

  // Log the received request body to debug
  console.log("Request Body:", req.body);

  if (!answer) {
    return res.status(400).send("Answer is required");
  }

  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }] }] : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, chatId: userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );

    if (updatedChat.nModified === 0) {
      return res.status(404).send("Chat not found or not modified");
    }

    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});


app.get("/api/chatlist", authenticate, async (req, res) => {
  try {
    const userId = req.auth.userId; // Extract userId from the token (authentication middleware)

    // Find chats associated with the logged-in user
    const chats = await Chat.find({ chatId: userId });

    // Return the chat data
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chats.");
  }
});


// Error handling middleware for unauthorized access
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});



app.post('/api/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', { path: '/' }); // This clears the token cookie
    res.clearCookie('user', { path: '/' }); // Optionally clear user cookie as well

    // Send response confirming the logout
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging out' });
  }
});


// PRODUCTION
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });


app.use("/api", quizRoutes);



app.listen(port, () => {
  connect();
  console.log(`Server running on ${port}`);
});




