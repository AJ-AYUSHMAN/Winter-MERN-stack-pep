const express = require("express");
const fsPromises = require("fs/promises");
const PORT = 1010;

const app = express();
app.use(express.json());

const FILE_PATH = "data.json";

// DUMMY API to check if server is running
app.get("/", (req, res) => {
    res.send(<h1>Server is running on PORT : ${PORT}</h1>);
});

// CREATE (POST) :: Add a new task
app.post("/tasks", async (req, res) => {
    try {
        const newObj = req.body;

        // Read the current list
        let text = await fsPromises.readFile(FILE_PATH, "utf-8");
        if (text.length === 0) text = "[]";
        const arr = JSON.parse(text);

        // Generate a new ID
        let newId = 1;
        if (arr.length !== 0) {
            newId = arr[arr.length - 1].id + 1;
        }

        // Assign ID & append to the list
        newObj.id = newId;
        arr.push(newObj);

        // Save to file
        await fsPromises.writeFile(FILE_PATH, JSON.stringify(arr, null, 2));

        res.status(201).json({ status: "success", task: newObj });
    } catch (err) {
        console.log("Error in POST /tasks:", err.message);
        res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
});

// READ (GET) :: Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const text = await fsPromises.readFile(FILE_PATH, "utf-8");
        const obj = JSON.parse(text);

        res.status(200).json({ status: "success", data: { tasks: obj } });
    } catch (err) {
        console.log("Error in GET /tasks:", err.message);
        res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
});

// UPDATE (PATCH) :: Update a task by ID
app.patch("/tasks/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTaskInfo = req.body;

        // Read current list
        const text = await fsPromises.readFile(FILE_PATH, "utf-8");
        const arr = JSON.parse(text);

        // Find index of the task
        const foundIndex = arr.findIndex(task => task.id == taskId);
        if (foundIndex === -1) {
            return res.status(400).json({ status: "fail", message: "Invalid Task Id!" });
        }

        // Update the task
        arr[foundIndex] = { ...arr[foundIndex], ...updatedTaskInfo };

        // Save updated list to file
        await fsPromises.writeFile(FILE_PATH, JSON.stringify(arr, null, 2));

        res.status(200).json({ status: "success", data: { task: arr[foundIndex] } });
    } catch (err) {
        console.log("Error in PATCH /tasks:", err.message);
        res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`
-------------------------------------------------
------- Server Started on PORT : ${PORT} --------
------- link: http://localhost:${PORT}/ ---------
-------------------------------------------------
`);
});
