// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // User schema definition
// const userSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//   },
//   chat: [
//     {
//       _id: {
//         type: String,
//         required: true,
//       },
//       title: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now()
//       },
//     },
//   ],

//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,  // Ensure unique email
//     match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],  // Validate email format
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// }, { timestamps: true });

// // Hash password before saving it to the database
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();  // Only hash password if modified

//   const salt = await bcrypt.genSalt(10);  // Generate salt
//   this.password = await bcrypt.hash(this.password, salt);  // Hash password
//   next();
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);  // Compare input password with hashed password
// };

// export default mongoose.model("User", userSchema);


// // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzMyM2FjY2UzY2U5OGY2YjYyMjk2OTYiLCJpYXQiOjE3MzEzNDUxMDAsImV4cCI6MTczMTM0ODcwMH0.HhqgEcFMcU_DjADcWlDm01ISpY7j2PpLoZc48cjh3Co

// // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzMyM2FjY2UzY2U5OGY2YjYyMjk2OTYiLCJpYXQiOjE3MzEzNDUxMjEsImV4cCI6MTczMTQzMTUyMX0.hC7v-955GZ3ikPO8ks8BYKJOiMDrO5ujY82BLZUlo4Y

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema definition
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    chat: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    scores: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        score: { type: Number, default: 0 },
        attempts: { type: Number, default: 0 },
        lastAttempt: { type: Date },
      },
    ],
    leaderboard: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        score: { type: Number, default: 0 },
        username: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    username: {
      type: String,
      // required: true,
      // unique: true,
    },

    imageUrl: String,

    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
