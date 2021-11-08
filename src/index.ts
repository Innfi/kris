import { Trady } from './app';

const app = new Trady();

app.start();

// import express, { Request, Response } from 'express';
// import axios from 'axios';

// const testFetch = async (): Promise<unknown> => {
//   const response = await axios.get(`${testUrl}${apiKey}`);
//   return response.data;
// };

// const app = express();

// app.get('/', async (_req: Request, res: Response) => {
//   res.status(200).send({
//     err: 'ok',
//   }).end();
// });

// app.get('/test', async (_req: Request, res: Response) => {
//   const resp = await testFetch();
//   res.status(200).send({
//     err: 'ok',
//     data: resp,
//   });
// });

// app.listen(3000, () => {
//   console.log('listen');
// });
