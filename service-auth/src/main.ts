process.on('SIGINT', async () => {
  try {
    process.exit(0);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
});

try {
} catch {
  console.error('Error starting the server');
  process.exit(1);
}
