const express = require("express");
const bp = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const app = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get jokes
app.get("/api/joke", (req, res) => {
  const jokes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "joke.json"), "utf-8")
  );
  res.json(jokes);
});

// Add a joke
app.post("/api/joke", (req, res) => {
  const jokeID = req.body.id;
  const newJoke = req.body.joke;

  const jokeData = {
    id: jokeID,
    joke: newJoke,
  };

  if (!newJoke) {
    return res.status(400).json({ message: "Invalid joke!" });
  }

  try {
    const filePath = path.join(__dirname, "joke.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const jokes = JSON.parse(data);

    jokes.push(jokeData);

    fs.writeFileSync(filePath, JSON.stringify(jokes, null, 2), "utf-8");

    console.log("Joke added successfully!");
    res.status(201).json({ message: "Joke added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add joke." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  );
});
