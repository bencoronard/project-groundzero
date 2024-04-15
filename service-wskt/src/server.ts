// Import the WebSocket module
import WebSocket from 'ws';

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8080 });

// Define a timeout duration (in milliseconds) for inactive connections
const INACTIVE_TIMEOUT = 60000; // 1 minute

// Function to send a ping message to clients
function sendPing(ws: WebSocket) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.ping();
  }
}

// Event handler for WebSocket connections
wss.on('connection', (ws: WebSocket) => {
  console.log('A new client connected');

  // Set up heartbeat interval for the connection
  const heartbeatInterval = setInterval(() => {
    sendPing(ws); // Send a ping message to the client
  }, 30000); // Send a ping every 30 seconds

  // Event handler for incoming messages from clients
  ws.on('message', (message: string) => {
    console.log(`Received message from client: ${message}`);

    // Echo back the received message to the client
    ws.send(`Echo: ${message}`);
  });

  // Event handler for WebSocket connection closure
  ws.on('close', () => {
    console.log('Client disconnected');

    // Clear the heartbeat interval when the client disconnects
    clearInterval(heartbeatInterval);
  });

  // Event handler for WebSocket ping messages
  ws.on('ping', () => {
    console.log('Received ping from client');
    // Respond with a pong message to maintain the connection
    ws.pong();
  });

  // Set up a timeout to detect inactive connections
  let inactiveTimeout: NodeJS.Timeout;
  function resetInactiveTimeout() {
    clearTimeout(inactiveTimeout);
    inactiveTimeout = setTimeout(() => {
      console.log('Inactive connection detected. Closing...');
      ws.terminate(); // Close the connection for inactive clients
    }, INACTIVE_TIMEOUT);
  }

  // Start the inactive timeout when the connection is established
  resetInactiveTimeout();

  // Reset the inactive timeout when a message is received from the client
  ws.on('message', () => {
    resetInactiveTimeout();
  });
});

// Log a message when the server starts listening
wss.on('listening', () => {
  console.log('WebSocket server is running on port 8080');
});
