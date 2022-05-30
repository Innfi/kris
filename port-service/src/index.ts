import { Container } from 'typedi';
import dotenv from 'dotenv';

import { App } from './app';

dotenv.config();

const app = Container.get(App);

app.start();
