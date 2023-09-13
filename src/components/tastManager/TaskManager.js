import {useState, useRef, useEffect} from 'react'
import useLocalStorage from "use-local-storage";
import Task from './Task';
import './TaskManager.css'


const TaskManager = () => {
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")
    // const [tasks, setTasks] = useState([])

    const [tasks, setTasks] = useLocalStorage("tasks", [])

    const [taskID, setTaskID] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const nameInputRef = useRef(null)

    useEffect(() => {
        nameInputRef.current.focus()
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !date) {
            alert("Either field cannot be empty")
        }
        else if (name && date && isEditing) {
            setTasks(
                tasks.map((task) => {
                    if (task.id === taskID) {
                        return {...task, name: name, date: date, description: description, complete: false}
                    }
                    return task
                })
            )
            setName("")
            setDate("")
            setDescription("")
            setIsEditing(false)
            setTaskID(null)
        }
        else{
            const newTask = {
                id: Date.now(),
                name: name,
                date: date,
                description: description,
                complete: false
            }
            setTasks([...tasks, newTask])
            setName("")
            setDate("")
            setDescription("")

        }
    }

    const editTask = (id) => {
        const thisTask = tasks.find((task) => task.id === id)
        setIsEditing(true)
        setTaskID(id)
        setName(thisTask.name)
        setDate(thisTask.date)
        setDescription(thisTask.description)
    }

    const deleteTask = (id) => {
        if (window.confirm("Delete this task ?") === true) {
            const newTask = tasks.filter((task) => task.id !== id)
            setTasks(newTask)
        }
    }

    const completeTask = (id) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    return {...task, complete: true}
                }
                return task
            })
        )
    }

return (
<div className="--bg-primary">
    <h1 className="--text-center --text-light">Task Manager</h1>
    <div className="--flex-center --p">
        <div className="--card --bg-light --width-500px --p --flex-center">
        <form onSubmit={handleSubmit} className="form --form-control">
            <div>
            {/* <label htmlFor="name">Task:</label> */}
            <input
                ref={nameInputRef}
                type="text"
                placeholder="Task title"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>

            <div>
            {/* <label htmlFor="date">Date:</label> */}
            <input
                type="date"
                placeholder="Task date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            </div>
            <div>
            {/* <label htmlFor="description">Description:</label> */}
            <textarea
                name='description' 
                placeholder='Task description' 
                rows={8}
                cols={35}
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
            </div>
            <button className="--btn --btn-success --btn-block">
            {isEditing ? "Edit Task" : "Save Task"}
            </button>
        </form>
        </div>
    </div>
      {/* Display Task */}

    <article className="--flex-center --my2">
        <div className="--width-500px --p">
        <h2 className="--text-light">Task List</h2>
        <hr style={{ background: "#fff" }} />
        {tasks.length === 0 ? (
            <p className="--text-light">No task added...</p>
        ) : (
            <div>
            {tasks.map((task) => {
                return (
                <Task
                    {...task}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    completeTask={completeTask}
                />
                );
            })}
            </div>
        )}
        </div>
    </article>
</div>
)
}

export default TaskManager
