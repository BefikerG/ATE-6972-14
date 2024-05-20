const http = require("http");
const url = require("url");

const port = 3000;

// Create a server
const server = http.createServer((req, res) => {
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

  // Handling POST request
  if (req.method === "POST" && req.url === "/contact-us") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });

    req.on("end", () => {
      const data = JSON.parse(body); // Parse JSON data
      console.log("Received data:", data);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Data received successfully.");
    });
  } else {
    // Handling unsupported routes/methods
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
