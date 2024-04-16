import WebSocket from 'ws';
import dotenv from 'dotenv';

const wss = new WebSocket.Server({ port: 8080 });
main();

async function main(): Promise<void> {
  try {
    const {
      port: PORT,
      timeout: INACTIVE_TIMEOUT,
      socket: wss,
    } = await initialize();

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

    process.on('SIGINT', async () => {
      console.log('WebSocket closed.');
    });

    wss.on('listening', () => {
      console.log(`WebSocket server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting the server...\n`, error);
    process.exit(1);
  }
}

async function setup(): Promise<{
  port: number;
  timeout: number;
}> {
  try {
    dotenv.config();
    const result = { port: 0, timeout: 0 };
    if (process.env.PORT && process.env.TIMEOUT) {
      result.port = parseInt(process.env.PORT, 10);
      result.timeout = parseInt(process.env.TIMEOUT, 10);
      return result;
    } else {
      throw new Error('Missing environment variables');
    }
  } catch (error) {
    throw error;
  }
}

async function initialize(): Promise<{
  port: number;
  timeout: number;
  socket: WebSocket.Server;
}> {
  try {
    const server: { port: number; timeout: number } = await setup();
    const wss = new WebSocket.Server({ port: server.port });
    return { port: server.port, timeout: server.timeout, socket: wss };
  } catch (error) {
    throw error;
  }
}

function sendPing(ws: WebSocket) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.ping();
  }
}
