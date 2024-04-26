import dotenv from 'dotenv';
import express, { Application } from 'express';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';
import { RecordRepository } from './entities/RecordRepository';
import { StorageMySQL } from './detachables/StorageMySQL';
import { StorageMongoDB } from './detachables/StorageMongoDB';
import path from 'path';

export class Server {
  private db: RecordRepository;
  private app: Application;
  private params: { port: number; dbType: string };

  constructor() {
    try {
      dotenv.config({ path: path.resolve(__dirname, '.env') });
      this.params = this.config();
      this.db = this.setupDB();
      this.app = express();
    } catch (error) {
      throw error;
    }
  }

  private config(): {
    port: number;
    dbType: string;
  } {
    if (process.env.PORT && process.env.DB_TYPE) {
      return {
        port: parseInt(process.env.PORT, 10),
        dbType: process.env.DB_TYPE,
      };
    } else {
      throw new Error('Missing environment variables');
    }
  }

  private setupDB(): RecordRepository {
    try {
      if (process.env.CONFIG_MYSQL && this.params.dbType === 'MySQL') {
        const credentials = JSON.parse(process.env.CONFIG_MYSQL);
        if (
          credentials.host &&
          credentials.user &&
          credentials.password &&
          credentials.database &&
          credentials.table
        ) {
          return new StorageMySQL(credentials);
        } else {
          throw new Error('Incomplete database config');
        }
      } else if (process.env.CONFIG_MONGO && this.params.dbType === 'MongoDB') {
        const credentials = JSON.parse(process.env.CONFIG_MONGO);
        if (credentials.uri && credentials.database && credentials.collection) {
          return new StorageMongoDB(credentials);
        } else {
          throw new Error('Incomplete database config');
        }
      } else {
        throw new Error('Missing or invalid database config');
      }
    } catch (error) {
      throw error;
    }
  }

  start() {
    try {
      const interactor = new Interactor(this.db);
      const controller = new Controller(interactor);

      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.all('/records*', async (req, res) => {
        try {
          const reqHTTP = new ExpressHTTP(req);
          const resHTTP = await controller.route(reqHTTP);
          res
            .status(resHTTP.statusCode)
            .set(resHTTP.headers)
            .send(resHTTP.body);
        } catch (error) {
          res.status(500).json({
            isError: true,
            desc: 'Error message',
            data: (error as Error).message,
          });
        }
      });

      this.app.listen(this.params.port, () => {
        console.log(`Server listening on port: ${this.params.port}`);
      });
    } catch (error) {
      throw error;
    }
  }

  async stop() {
    try {
      await this.db.closeConnection();
      console.log('Database connections closed');
    } catch {
      throw new Error('Error closing database connections');
    }
  }
}
