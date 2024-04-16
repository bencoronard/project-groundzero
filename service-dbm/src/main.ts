import { Server } from './Server';

const server = new Server();

process.on('SIGINT', async () => {
  try {
    await server.stop();
    process.exit(0);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
});

try {
  server.start();
} catch {
  console.error('Error starting the server');
  process.exit(1);
}
