import express from 'express';
import dotenv from 'dotenv';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';
import { RecordRepository } from './entities/RecordRepository';
import { StorageMySQL } from './detachables/StorageMySQL';
import { StorageMongoDB } from './detachables/StorageMongoDB';

const app = express();
main();

async function main(): Promise<void> {
  try {
    const { port: PORT, db: database } = await initialize();

    process.on('SIGINT', async () => {
      await closeDB(database);
    });

    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting the server...\n`, error);
    process.exit(1);
  }
}

async function setup(): Promise<{
  port: number;
  db: RecordRepository;
}> {
  try {
    dotenv.config();
    const result = { port: 0, db: {} as RecordRepository };
    if (process.env.PORT && process.env.DB_TYPE) {
      result.port = parseInt(process.env.PORT, 10);
      const dbType: string = process.env.DB_TYPE;
      if (process.env.CONFIG_MYSQL && dbType === 'MySQL') {
        const config = JSON.parse(process.env.CONFIG_MYSQL);
        if (
          config.host &&
          config.user &&
          config.password &&
          config.database &&
          config.table
        ) {
          result.db = new StorageMySQL(config);
        } else {
          throw new Error('Incomplete database config');
        }
      } else if (process.env.CONFIG_MONGO && dbType === 'MongoDB') {
        const config = JSON.parse(process.env.CONFIG_MONGO);
        if (config.uri && config.database && config.collection) {
          result.db = new StorageMongoDB(config);
        } else {
          throw new Error('Incomplete database config');
        }
      } else {
        throw new Error('Missing or invalid database config');
      }
      return result;
    } else {
      throw new Error('Missing environment variables');
    }
  } catch (error) {
    throw error;
  }
}

async function initialize(): Promise<{ port: number; db: RecordRepository }> {
  try {
    const server: { port: number; db: RecordRepository } = await setup();
    const interactor = new Interactor(server.db);
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
    return server;
  } catch (error) {
    throw error;
  }
}

async function closeDB(db: RecordRepository): Promise<void> {
  try {
    await db.closeConnection();
    console.log('Database connections closed');
    process.exit(0);
  } catch {
    console.error('Error closing database connections');
    process.exit(1);
  }
}
