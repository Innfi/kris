import { Container, Service } from 'typedi';

import AdapterFile from './adapter.file';
import AdapterRedis from './adapter.redis';
import DataReference from './data.ref';
import StatRepository from './repository';

@Service()
class StatRepositoryFactory {
  createRepositoryLocal(): StatRepository {
    return new StatRepository(
      Container.get(DataReference),
      Container.get(AdapterFile),
    );
  }

  createRepositoryCompose(): StatRepository {
    return new StatRepository(
      Container.get(DataReference),
      Container.get(AdapterRedis),
    );
  }
}

export default StatRepositoryFactory;
