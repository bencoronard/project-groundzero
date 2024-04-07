import express from 'express';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { StorageMySQL } from './detachables/StorageMySQL';
import { StorageMongoDB } from './detachables/StorageMongoDB';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';

const PORT: number = 3000;
const typeDB: string = 'MySQL';
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

process.on('SIGINT', shutdownApp);
startApp();

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

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

async function shutdownApp(): Promise<void> {
  try {
    switch (typeDB) {
      case 'MongoDB':
        console.log('Mongo!');
        break;
      case 'MySQL':
        console.log('Sequel!');
        break;
      default:
        console.log('Forget!');
        break;
    }
    console.log('Database connections closed');
    process.exit(0);
  } catch {
    console.log('Error closing database connections');
    process.exit(1);
  }
}
