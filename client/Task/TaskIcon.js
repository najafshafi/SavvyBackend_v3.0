// TaskIcon.js
import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./TaskIcon.css";

const TaskIcon = () => {
    // const navigate = useNavigate();

    const handleClick = () => {
        // navigate("/tasks"); // Redirect to the Task page
    };

    return (
        <div className="todo-icon" onClick={handleClick}>
            <img
                src="https://cdn-icons-png.flaticon.com/512/2621/2621074.png" // Example task icon
                alt="To Do List"
            />
            <span>To Do List</span>
        </div>
    );
};

export default TaskIcon;
