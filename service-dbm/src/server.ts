import express from 'express';
import dotenv from 'dotenv';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';
import { RecordRepository } from './entities/RecordRepository';
// import { StorageMySQL } from './detachables/StorageMySQL';
import { StorageMongoDB } from './detachables/StorageMongoDB';

dotenv.config();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

const config = JSON.parse(process.env.CONFIG_MYSQL);
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'valorant',
  table: 'agents',
};

const config = JSON.parse(process.env.CONFIG_MONGO);
const dbConfig = {
  uri: 'mongodb://localhost:27017',
  database: 'valorant',
  collection: 'agents',
};
const app = express();

main();

async function main(): Promise<void> {
  try {
    const db: RecordRepository = await initialize();
    process.on('SIGINT', async () => {
      await closeDB(db);
    });
    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  } catch {
    console.error('Error starting the server');
    process.exit(1);
  }
}

async function initialize(): Promise<RecordRepository> {
  // const db = new StorageMySQL(dbConfig);
  const db = new StorageMongoDB(dbConfig);
  const interactor = new Interactor(db);
  const controller = new Controller(interactor);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.all('/records*', async (req, res) => {
    try {
      const reqHTTP = new ExpressHTTP(req);
      const resHTTP = await controller.route(reqHTTP);
      res.status(resHTTP.statusCode);
      res.set(resHTTP.headers);
      res.send(resHTTP.body);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
  return db;
}

async function closeDB(db: RecordRepository): Promise<void> {
  try {
    await db.closeConnection();
    console.log('Database connections closed');
    process.exit(0);
  } catch {
    console.log('Error closing database connections');
    process.exit(1);
  }
}
