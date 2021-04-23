const express = require("express");
const app = express();
const { nanoid } = require("nanoid");
const port = 4000;

// Express Middleware
app.use(express.json());

// Database
let db = {
  users: [
    {
      id: nanoid(),
      firstName: "Brandon",
      lastName: "Shipley",
      username: "bshipley",
      password: "12345",
      email: "bshipley1289@gmail.com",
      phoneNumber: "903-721-1203",
      createdAt: Date.now(),
      todos: [
        {
          id: nanoid(),
          title: "ScrumMaster",
          details: "Doing the scrum stuff",
          completed: false,
          priority: "High",
          tag: "default",
        },
      ],
    },
    {
      id: nanoid(),
      firstName: "Terry",
      lastName: "Cross",
      username: "TCross",
      password: "12345",
      email: "tcrossband.86@gmail.com",
      phoneNumber: "909-587-8922",
      createdAt: Date.now(),
      todos: [
        {
          id: nanoid(),
          title: "Project Owner",
          details: "Boss people around!",
          completed: false,
          priority: "High",
          tag: "default",
        },
      ],
    },
    {
      id: nanoid(),
      firstName: "Jared",
      lastName: "Fajman",
      username: "JFajman",
      password: "12345",
      email: "jmfajman@gmail.com",
      phoneNumber: "520-318-4293",
      createdAt: Date.now(),
      todos: [
        {
          id: nanoid(),
          title: "QA",
          details: "Reviewing Code",
          completed: false,
          priority: "High",
          tag: "default",
        },
      ],
    },
    {
      id: nanoid(),
      firstName: "Dawit",
      lastName: "Lemma",
      username: "DLemma",
      email: "delfan2003@gmail.com",
      phoneNumber: "000-000-0000",
      createdAt: Date.now(),
      todos: [
        {
          id: nanoid(),
          title: "Backend",
          details: "Setting up backend code",
          completed: true,
          priority: "High",
          tag: "default",
        },
      ],
    },
  ],
};

// access database
app.get("/", (req, res) => {
  res.send("Database is accessable");
});

// get all users
app.get("/users", (req, res) => {
  res.send(db.users);
});

// login
app.get("/login/user", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Missing required field");
  }
  let selectedUser = db.users.findIndex(
    (user) => user.username === req.body.username
  );
  if (selectedUser === -1) {
    res.status(404).send("Incorrect username or password");
  }
  if (db.users[selectedUser].password !== req.body.password) {
    res.status(404).send("Incorrect username or password");
  }
  res.send(db.users[selectedUser]);
});

// get single user by id
app.get("/user/:userId", (req, res) => {
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  res.send(db.users[selectedUser]);
});

// create user
app.post("/user/create", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Missing required field");
  }
  let newUser = {
    id: nanoid(),
    firstName: "",
    lastName: "",
    username: req.body.username,
    password: req.body.password,
    email: "",
    phoneNumber: "",
    createdAt: Date.now(),
    todos: [],
  };
  db.users.push(newUser);
  res.send("Successfully Created New User");
});

// edit user
app.patch("/user/:userId", (req, res) => {
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  if (req.body.username) {
    let checkingUsername = db.users.find(
      (user) => user.username === req.body.username
    );
    if (checkingUsername.id !== req.params.userId) {
      res.status(403).send("Username not available");
    }
  }
  db.users[selectedUser] = {
    ...db.users[selectedUser],
    firstName: req.body.firstName || db.users[selectedUser].firstName,
    lastName: req.body.lastName || db.users[selectedUser].lastName,
    username: req.body.username || db.users[selectedUser].username,
    email: req.body.email || db.users[selectedUser].email,
    phoneNumber: req.body.phoneNumber || db.users[selectedUser].phoneNumber,
  };
  res.send({
    status: "User edited successfully",
    user: db.users[selectedUser],
  });
});

// delete user
app.delete("/user/:userId", (req, res) => {
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  db = db.users.splice(selectedUser, 1);
  res.send("Deleted Successfully");
});

// get todos list of user
app.get("/user/:userId/todos", (req, res) => {
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  res.send(db.users[selectedUser].todos);
});

// get single todo from user
app.get("/user/:userId/todos/:todoId", (req, res) => {
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }

  let selectedTodo = db.users[selectedUser].todos.findIndex(
    (todo) => todo.id == req.params.todoId
  );
  if (selectedTodo === -1) {
    res.status(404).send("Todo not found");
  }
  res.send(db.users[selectedUser].todos[selectedTodo]);
});

// add todo item
app.post("/user/:userId/todos/create", (req, res) => {
  if (!req.body.title) {
    res.status(400).send("Missing required field");
  }
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  let newTodo = {
    id: nanoid(),
    title: req.body.title,
    details: req.body.details || "",
    completed: false,
    priority: req.body.priority || "low",
    tag: req.body.tag || "default",
  };
  db.users[selectedUser].todos.push(newTodo);
  res.send("Todo Successfully Created");
});

// edit todo item
app.patch("/user/:userId/todos/:todoId", (req, res) => {
  if (!req.body.title) {
    res.status(400).send("Missing required field");
  }
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  let selectedTodo = db.users[selectedUser].todos.findIndex(
    (todo) => todo.id == req.params.todoId
  );
  if (selectedTodo === -1) {
    res.status(404).send("Todo not found");
  }
  db.users[selectedUser].todos[selectedTodo] = {
    ...db.users[selectedUser].todos[selectedTodo],
    title: req.body.title,
    details: req.body.details || "",
    completed: req.body.completed || false,
    priority: req.body.priority || "low",
    tag: req.body.tag || "default",
  };
  res.send("Todo Successfully Edited");
});

// delete todo item
app.delete("/user/:userId/todos/:todoId", (req, res) => {
  let selectedUser = db.users.findIndex((user) => user.id == req.params.userId);
  if (selectedUser === -1) {
    res.status(404).send("User Not Found");
  }
  let selectedTodo = db.users[selectedUser].todos.findIndex(
    (todo) => todo.id == req.params.todoId
  );
  if (selectedTodo === -1) {
    res.status(404).send("Todo not found");
  }
  db = db.users[selectedUser].todos.splice(selectedTodo, 1);
  res.send("Todo Successfully Deleted");
});

app.listen(port, () => {
  console.log(`Your backend is running at http://localhost:${port}`);
});
