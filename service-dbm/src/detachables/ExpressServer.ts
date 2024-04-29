import dotenv from 'dotenv';
import path from 'path';
import express, { Application } from 'express';
import { ExpressHTTP } from './ExpressHTTP';
import { Interactor } from '../operators/Interactor';
import { Controller } from '../operators/Controller';
import { RecordRepository } from '../entities/RecordRepository';
import { StorageMySQL } from './StorageMySQL';
import { StorageMongoDB } from './StorageMongoDB';
import { IResponseHTTP } from '../shared/ResponseHTTP';
import { RequestHTTP } from '../shared/RequestHTTP';
import { Server } from '../shared/Server';

export class ExpressServer implements Server {
  private db: RecordRepository;
  private app: Application;
  private params: { port: number; dbType: string };

  constructor() {
    try {
      // Read parameters in .env file
      dotenv.config({ path: path.resolve(__dirname, '.env') });
      this.params = this.config();
      // Create a database connection
      this.db = this.setupDB();
      // Start Express application
      this.app = express();
    } catch (error) {
      // Propagate error thrown during server instantiation
      throw error;
    }
  }

  private config(): {
    port: number;
    dbType: string;
  } {
    // Check missing parameters in .env file
    if (process.env.PORT && process.env.DB_TYPE) {
      // Return PORT and TYPE of database to use
      return {
        port: parseInt(process.env.PORT, 10),
        dbType: process.env.DB_TYPE,
      };
    } else {
      // Some parameters missing
      throw new Error('Missing environment variables');
    }
  }

  private setupDB(): RecordRepository {
    try {
      // Check for MySQL selection
      if (process.env.CONFIG_MYSQL && this.params.dbType === 'MySQL') {
        // Parse MySQL credentials
        const credentials = JSON.parse(process.env.CONFIG_MYSQL);
        // Check for missing MySQL credentials
        if (
          credentials.host &&
          credentials.user &&
          credentials.password &&
          credentials.database &&
          credentials.table
        ) {
          // Construct MySQL connection
          return new StorageMySQL(credentials);
        } else {
          // Some database parameters missing
          throw new Error('Incomplete database config');
        }
        // Check for MongoDB selection
      } else if (process.env.CONFIG_MONGO && this.params.dbType === 'MongoDB') {
        // Parse MongoDB credentials
        const credentials = JSON.parse(process.env.CONFIG_MONGO);
        // Check for missing MongoDB credentials
        if (credentials.uri && credentials.database && credentials.collection) {
          // Construct MongoDB connection
          return new StorageMongoDB(credentials);
        } else {
          // Some database parameters missing
          throw new Error('Incomplete database config');
        }
      } else {
        // Database configuration missing
        throw new Error('Missing or invalid database config');
      }
    } catch (error) {
      // Propagate errors thrown during database setup
      throw error;
    }
  }

  start(): void {
    try {
      // Instantiate Interactor
      const interactor = new Interactor(this.db);
      // Instantiate Controller
      const controller = new Controller(interactor);
      // Configure Express middleware
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.all('/records*', async (req, res) => {
        try {
          // Adapt request object from Express
          const reqHTTP: RequestHTTP = new ExpressHTTP(req);
          // Route request and await response
          const resHTTP: IResponseHTTP = await controller.route(reqHTTP);
          // Send successful response
          res
            .status(resHTTP.statusCode)
            .set(resHTTP.headers)
            .json(resHTTP.body);
        } catch (error) {
          // Catch errors during operations and send as response
          res.status(500).json({
            isError: true,
            description: 'Error message',
            payload: 'Internal server error',
          });
        }
      });
      // Start server
      this.app.listen(this.params.port, () => {
        console.log(`Server listening on port: ${this.params.port}`);
      });
    } catch (error) {
      // Propagate errors thrown during server starting
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      // Close database connections
      await this.db.closeConnection();
      console.log('Database connections closed');
    } catch (error) {
      // Propagate errors thrown during connection closing
      throw error;
    }
  }
}
