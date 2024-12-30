// import Task from "../models/Task"; // Import Task schema

// // Create a new task
// export const createTask = async (req, res) => {
//     try {
//         const { id, title, priority, status, progress } = req.body;

//         const user = req.user;
//         const userId = req.auth.userId;
//         console.log(user);
//         console.log(userId);

//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         // Create a new task
//         const task = new Task({
//             id,
//             title,
//             priority,
//             status,
//             progress,
//             user: user._id, // Link the task to the authenticated user
//         });

//         await task.save();
//         res.status(201).json({ message: "Task created successfully", task });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to create task", error: error.message });
//     }
// };

// // Get all tasks for the authenticated user
// export const getTasks = async (req, res) => {
//     try {
//         const user = req.user;
//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const tasks = await Task.find({ user: user._id }); // Get tasks for the logged-in user
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
//     }
// };

// // Update a task by ID
// export const updateTask = async (req, res) => {
//     try {
//         const user = req.user;
//         const { id } = req.params;

//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const updatedTask = await Task.findOneAndUpdate(
//             { id, user: user._id }, // Ensure the task belongs to the authenticated user
//             req.body,
//             { new: true } // Return the updated document
//         );

//         if (!updatedTask) {
//             return res.status(404).json({ message: "Task not found" });
//         }

//         res.status(200).json({ message: "Task updated successfully", updatedTask });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to update task", error: error.message });
//     }
// };

// // Delete a task by ID
// export const deleteTask = async (req, res) => {
//     try {
//         const user = req.user;
//         const { id } = req.params;

//         if (!user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const deletedTask = await Task.findOneAndDelete({ id, user: user._id }); // Ensure the task belongs to the user

//         if (!deletedTask) {
//             return res.status(404).json({ message: "Task not found" });
//         }

//         res.status(200).json({ message: "Task deleted successfully", deletedTask });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to delete task", error: error.message });
//     }
// };


import Task from "../models/Task.js"; // Ensure the file name matches

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { id, title, priority = "low", status = "got to the gym", progress = 0 } = req.body; // Default values
        const user = req.auth.userId;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Create a new task linked to the authenticated user
        const task = new Task({
            id,
            title,
            priority,
            status,
            progress,
            user: user._id,
        });

        await task.save();
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Failed to create task", error: error.message });
    }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try {
        const user = req.auth.userId;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch tasks linked to the authenticated user
        const tasks = await Task.find({ user: user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};

// Update a task by ID
export const updateTask = async (req, res) => {
    try {
        const user = req.auth.userId;
        const { id } = req.params;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updatedTask = await Task.findOneAndUpdate(
            { id, user: user._id }, // Ensure the task belongs to the authenticated user
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
    try {
        const user = req.auth.userId;
        const { id } = req.params;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const deletedTask = await Task.findOneAndDelete({ id, user: user._id }); // Ensure the task belongs to the user

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully", deletedTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error: error.message });
    }
};
