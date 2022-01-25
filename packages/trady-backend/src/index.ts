import 'reflect-metadata';
import { Container } from 'typedi';
import Trady from './app';

const app = Container.get(Trady);

app.start();
