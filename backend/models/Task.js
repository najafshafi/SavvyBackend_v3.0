import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true, // The id is required
        unique: true, // Ensures the id is unique
    },
    title: {
        type: String,
        required: true, // The title is required
        trim: true, // Removes extra spaces
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"], // Ensures only these values are allowed
        default: "low", // Default priority if not provided
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed"], // Ensures valid status values
        default: "To Do", // Default status if not provided
    },
    progress: {
        type: Number,
        min: 0, // Minimum value for progress
        max: 100, // Maximum value for progress
        default: 0, // Default progress is 0
    },
});

export default mongoose.model("Task", taskSchema);
