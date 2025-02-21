import Task from "../models/Task.js"; 

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id});
    res.status(200).json(tasks);
  } catch (error) {
  
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};
// Create a Task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title ) { 
      return res.status(400).json({ message: "Task title is required!" });
    }

    const newTask = new Task({
      title,
      description: description || "no description"
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);

  } catch (error) {
    console.error("Task creating error:", error); 
    res.status(500).json({ message: "Error creating task" }); 
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id} = req.params;
    const { title, description, completed } =res.body;
    const updateTask = await Task.findByIdAndUpdate(
      id,{ title, description, completed}, { new: true }
    );

    if (!updateTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task update successfully", task: updateTask });
  } catch (error) {
   
    res.status(500).json({ message: "Error updating task", error });
  }
};


// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.parames;
    const deleteTask = await Task.findByIdAndDelete(id);
    if (!deleteTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).json({message: "Task deleted successfully"}); 
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};