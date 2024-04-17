import WebSocket from 'ws';
import dotenv from 'dotenv';

export class Server {
  private app: WebSocket.Server;
  private params: { port: number; timeout: number; heartbeat: number };

  constructor() {
    try {
      dotenv.config();
      this.params = this.config();
      this.app = new WebSocket.Server({ port: this.params.port });
    } catch (error) {
      throw error;
    }
  }

  private config(): {
    port: number;
    timeout: number;
    heartbeat: number;
  } {
    if (process.env.PORT && process.env.TIMEOUT && process.env.HEARTBEAT) {
      return {
        port: parseInt(process.env.PORT, 10),
        timeout: parseInt(process.env.TIMEOUT, 10),
        heartbeat: parseInt(process.env.HEARTBEAT, 10),
      };
    } else {
      throw new Error('Missing environment variables');
    }
  }

  start() {
    try {
      this.app.on('connection', (ws: WebSocket) => {
        let inactiveTimeout: NodeJS.Timeout;

        const heartbeatInterval: NodeJS.Timeout = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
          }
        }, this.params.heartbeat);

        const resetInactiveTimeout = () => {
          clearTimeout(inactiveTimeout);
          inactiveTimeout = setTimeout(() => {
            console.log('Inactive connection detected. Closing...');
            ws.terminate();
          }, this.params.timeout);
        };

        console.log('A new client connected');
        resetInactiveTimeout();

        ws.on('message', (message: string) => {
          console.log(`Received message from client: ${message}`);
          ws.send(`Echo: ${message}`);
          resetInactiveTimeout();
        });

        ws.on('ping', () => {
          console.log('Received ping from client');
          ws.pong();
          resetInactiveTimeout();
        });

        ws.on('close', () => {
          console.log('Client disconnected');
          clearInterval(heartbeatInterval);
          clearTimeout(inactiveTimeout);
        });
      });

      this.app.on('close', () => {
        this.app.clients.forEach((client) => {
          client.close(1000, 'Server-initiated disconnection');
        });
      });

      this.app.on('listening', () => {
        console.log(`WebSocket server is running on port ${this.params.port}`);
      });
    } catch (error) {
      throw error;
    }
  }

  async stop() {
    try {
      this.app.close(() => {
        console.log('WebSocket server closed');
      });
    } catch {
      throw new Error('Error closing WebSocket');
    }
  }
}
