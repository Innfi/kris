import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const testUrl = '';
const testFetch = async (): Promise<unknown> => {
  const response = await fetch(testUrl);
  return response.json();
};

const app = express();

app.get('/', async (_req: Request, res: Response) => {
  const resp = await testFetch();

  res.status(200).send({
    err: 'ok',
    data: resp,
  }).end();
});

app.listen(3000, () => {
  console.log('listen');
});
