import express from 'express';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { StorageMySQL } from './detachables/StorageMySQL';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';

const PORT: number = 3000;
const app = express();

const config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'valorant',
};
const table = 'agents';
const db = new StorageMySQL(config, table);

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
