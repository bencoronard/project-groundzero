import { MongoClient } from 'mongodb';
import express from 'express';

// Initialize Express app
const app = express();
const port = 3000;

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'yourDatabaseName';
const collectionName = 'yourCollectionName';

// Create a MongoDB client
const client = new MongoClient(mongoURI);

// Connect to MongoDB and start the server
async function startApp() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if MongoDB connection fails
  }
}

// Handle GET request to fetch data from MongoDB
app.get('/api/data', async (req, res) => {
  try {
    // Get MongoDB database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Perform MongoDB query
    const queryResult = await collection.find({}).toArray();

    // Send query result as JSON response
    res.json(queryResult);
  } catch (error) {
    console.error('Error handling GET request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle POST request to insert data into MongoDB
app.post('/api/data', express.json(), async (req, res) => {
  try {
    // Get MongoDB database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Extract data from request body
    const newData = req.body;

    // Insert data into MongoDB
    const insertResult = await collection.insertMany(newData);

    // Send insert result as JSON response
    res.json({ insertedCount: insertResult.insertedCount });
  } catch (error) {
    console.error('Error handling POST request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Close MongoDB connection when shutting down the application
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0); // Exit the application gracefully
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1); // Exit with error status
  }
});

// Start the application
startApp();
