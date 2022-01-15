import express from "express";
const app = express();
app.use(express.json());
import swaggerUI from "swagger-ui-express";
const swaggerDocument = require("../swagger.json");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
const users: { id: number; name: string; age: number }[] = [];
app.get("/", (req, res) => {
  res.json({
    message: "Hello World! 123",
  });
});
app.get("/users", (req, res) => {
  res.json({ users });
});
app.get("/users/filter", (req, res) => {
  const minAge = Number(req.query.minAge);
  const namePrefix = req.query.namePrefix as string;
  // console.log(minAge);
  // console.log(namePrefix);
  let filteredUsers = [...users];
  if (minAge) {
    filteredUsers = filteredUsers.filter((u) => u.age >= minAge);
  }
  if (namePrefix) {
    filteredUsers = filteredUsers.filter((u) => u.name.startsWith(namePrefix));
  }
  res.json({ users: filteredUsers });
});

app.post("/users", (req, res) => {
  // console.log(req.body);
  const user = { id: users.length, name: req.body.name, age: req.body.age };
  users.push(user);
  res.json({ user });
});
app.get("/users/:id", (req, res) => {
  // console.log(req.body);
  const id = +req.params.id;
  const user = users.find((u) => u.id === id);
  if (user) {
    res.json({
      user,
    });
  } else {
    res.json({
      message: "user not found",
    });
  }
});
app.patch("/users/:id", (req, res) => {
  // console.log(req.body);
  const id = +req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
    };
    res.json({
      user: users[userIndex],
    });
  } else {
    res.json({
      message: "user not found",
    });
  }
});
app.delete("/users/:id", (req, res) => {
  // console.log(req.body);
  const id = +req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({
      message: "deleted successfully",
    });
  } else {
    res.json({
      message: "user not found",
    });
  }
});
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
