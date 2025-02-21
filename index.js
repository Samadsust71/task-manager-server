require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qo68l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const DB = client.db("taskManagerDB");
    const userCollection = DB.collection("users");
    const taskCollection = DB.collection("tasks");

    // Initialize WebSocket server AFTER DB connection
    const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

    io.on("connection", (socket) => {
      console.log("New WebSocket Connection:", socket.id);
    });

    // Real-time updates using MongoDB Change Stream
    const changeStream = taskCollection.watch();
    changeStream.on("change", (change) => {
      console.log("Database Change Detected:", change);
      io.emit("taskUpdated", { type: change.operationType, data: change });
    });

    // Create a user
    app.post("/add-user", async (req, res) => {
        try {
          const user = req.body;
          const existingUser = await userCollection.findOne({ email: user.email });
      
          if (!existingUser) {
            const result = await userCollection.insertOne(user);
            return res.status(201).json({ message: "User added", user: result });
          }
      
          // Send a response even if the user exists
          res.status(200).json({ message: "User already exists", user: existingUser });
      
        } catch (error) {
          res.status(500).json({ message: "Server error", error });
        }
      });

    //  Create a task
    app.post("/tasks", async (req, res) => {
      try {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        io.emit("taskUpdated");
        res.send(result);
      } catch (error) {
        res.status(500).json({ message: "Task creation failed", error });
      }
    });

    //  Get all tasks
    app.get("/tasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email };
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ message: "Fetching tasks failed", error });
      }
    });

    // Update task category (for drag-and-drop)
    app.post("/update-task", async (req, res) => {
      try {
        const { _id, category } = req.body;
        await taskCollection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { category } }
        );
        io.emit("taskUpdated");
        res.json({ message: "Task updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Task update failed", error });
      }
    });

    //  Update task order (bulk update)
    app.post("/update-order", async (req, res) => {
      try {
        const { category, tasks } = req.body;

        const bulkOps = tasks.map((task, index) => ({
          updateOne: {
            filter: { _id: new ObjectId(task._id) },
            update: { $set: { order: index } },
          },
        }));

        await taskCollection.bulkWrite(bulkOps);
        io.emit("taskUpdated");
        res.json({ message: "Task order updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Task order update failed", error });
      }
    });

    //  Delete a task
    app.delete("/task/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          io.emit("taskUpdated");
          res.json({ message: "Task deleted successfully" });
        } else {
          res.status(404).json({ message: "Task not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Task deletion failed", error });
      }
    });

    // Update a task
    app.patch("/task/:id", async (req, res) => {
      try {
        const id = req.params.id
        const task = req.body;
        const query = { _id: new ObjectId(id) };
        
        const updateTask = {
          $set: {
            title: task.title,
            description: task.description,
            category : task.category
          },
        };

        const result = await taskCollection.updateOne(query, updateTask);
        res.send(result);
      } catch (error) {
        res.status(500).json({ message: "Task update failed", error });
      }
    });

    // Root Route
    app.get("/", (req, res) => {
      res.send("Task Manager server is running!");
    });

    // Start Server (Using server.listen for WebSockets)
    server.listen(port, () => {
      console.log(` Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
  }
}

run().catch(console.dir);
