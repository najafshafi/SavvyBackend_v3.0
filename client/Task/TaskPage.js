import "./TaskPage.css"
// import { ReactComponent as Add } from "./assets/icons/add.svg"
// import AddEditTaskForm from "./components/AddEditTaskForm"
import MyButton from "./components/Button/MyButton"
// import DeleteModal from "./components/DeleteModal"
// import TaskCard from "./components/TaskCard"
// import { taskList } from "./siteData/taskList"
import React from "react"
const TaskPage = () => {
    const showAddEditModal = false
    const showDeleteModal = false
    return (
        <div className="container">
            <div className="page-wrapper">
                <div className="top-title">
                    <h2>Task List</h2>
                    {/* <Button title="Add Task" icon={<Add />} onClick={() => { }} /> */}
                    <MyButton title="Add Task" onClick={() => { }} />
                </div>
                {/* <div className="task-container">
                    {taskList.map((task) => (
                        <TaskCard task={task} />
                    ))}
                </div> */}
            </div>
            {/* {showAddEditModal && <AddEditTaskForm />}
            {showDeleteModal && <DeleteModal />} */}
        </div>
    )
}

export default TaskPage
