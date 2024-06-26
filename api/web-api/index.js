const http = require("http");
const bcrypt = require("bcrypt");
const { connectDB } = require("./db");

const port = 3000;
const saltRounds = 10;

// Create a server
const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Length": 0,
    });
    res.end();
    return;
  }

  const handlePostRequest = async (req, res, endpoint) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });

    req.on("end", async () => {
      const data = JSON.parse(body); // Parse JSON data
      console.log(`Received data on ${endpoint}:`, data);

      const db = await connectDB();
      const usersCollection = db.collection("users");

      let message;
      switch (endpoint) {
        case "/contact-us":
          message = "Data received successfully.";
          break;

        case "/register":
          const existingUser = await usersCollection.findOne({
            email: data.email,
          });
          if (existingUser) {
            res.writeHead(409, { "Content-Type": "text/plain" });
            res.end("User already exists.");
            return;
          }

          const hashedPassword = await bcrypt.hash(data.password, saltRounds);
          await usersCollection.insertOne({
            email: data.email,
            password: hashedPassword,
          });
          message = "Registration successful.";
          break;

        case "/login":
          const user = await usersCollection.findOne({ email: data.email });
          if (!user) {
            res.writeHead(401, { "Content-Type": "text/plain" });
            res.end("Invalid email or password.");
            return;
          }

          // Compare password
          const match = await bcrypt.compare(data.password, user.password);
          if (!match) {
            res.writeHead(401, { "Content-Type": "text/plain" });
            res.end("Invalid email or password.");
            return;
          }

          message = "Login successful.";
          break;

        default:
          message = "Data received successfully.";
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(message);
    });
  };

  if (req.method === "POST") {
    if (
      req.url === "/contact-us" ||
      req.url === "/login" ||
      req.url === "/register"
    ) {
      handlePostRequest(req, res, req.url);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } else {
    // Handling unsupported methods
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
