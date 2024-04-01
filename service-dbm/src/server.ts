import express from 'express';
import { ExpressHTTP } from './detachables/ExpressHTTP';
import { InMemoryStorage } from './detachables/InMemoryStorage';
import { Interactor } from './operators/Interactor';
import { Controller } from './operators/Controller';

const PORT: number = 3000;
const app = express();

const db = new InMemoryStorage();
const interactor = new Interactor(db);
const controller = new Controller(interactor);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/records*', async (req, res) => {
  const reqHTTP = new ExpressHTTP(req);
  const resHTTP = await controller.route(reqHTTP);
  res.status(resHTTP.statusCode).set(resHTTP.headers);
  res.send(resHTTP.body);
  db.showRecords();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  db.showRecords();
});
