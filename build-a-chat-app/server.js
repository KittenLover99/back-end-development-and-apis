import http from "http";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT || 3001;

// 1. HTTP server that serves the chat page
const server = http.createServer((req, res) => {
  const file = req.url === "/script.js" ? "script.js" : "index.html";
  const type = file.endsWith(".js") ? "text/javascript" : "text/html";

  fs.readFile(`./public/${file}`, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading " + file);
      return;
    }

    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

// 2. WebSocket server attached to the HTTP server
const wss = new WebSocketServer({ server });

// Helper: send a message to every connected client
function broadcast(message) {
  const json = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// 3. Connection listener
wss.on("connection", (socket, req) => {
  // 4. Get the username from the URL and announce the join
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  broadcast({ type: "system", text: `${username} joined` });

  // 5. Relay chat messages to everyone, including the sender
  socket.on("message", (data) => {
    const { username, text } = JSON.parse(data.toString());
    broadcast({ type: "chat", username, text });
  });

  // 6. Announce when someone leaves
  socket.on("close", () => {
    broadcast({ type: "system", text: `${username} left` });
  });
});

// 7. Start the server
server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});