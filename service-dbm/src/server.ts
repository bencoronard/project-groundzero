import express from 'express';
import dotenv from 'dotenv';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { StorageMySQL } from './detachables/StorageMySQL';
import { StorageMongoDB } from './detachables/StorageMongoDB';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';
import { RecordRepository } from './entities/RecordRepository';

const main = async function (): Promise<void> {
  initialize();
  await startApp();
};
main();

async function startApp(): Promise<void> {
  const db = new StorageMySQL(config, table);
  const interactor = new Interactor(db);
  const controller = new Controller(interactor);

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

  process.on('SIGINT', async () => {
    await shutdownApp(db);
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

async function shutdownApp(db: RecordRepository): Promise<void> {
  try {
    await db.closeConnection();
    console.log('Database connections closed');
    process.exit(0);
  } catch {
    console.log('Error closing database connections');
    process.exit(1);
  }
}

function initialize(): void {
  dotenv.config();
  const PORT: number = parseInt(process.env.PORT || '3000', 10);
  const typeDB: string = process.env.DB_TYPE || 'MongoDB';
  const config = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'valorant',
  };
  const table = 'agents';

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}
