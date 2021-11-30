import { Service } from 'typedi';
import RedisClient from 'redis';


@Service()
class AdapterRedis {
  constructor() {}
};

export default AdapterRedis;