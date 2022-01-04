import { Container, Service } from 'typedi';

import AdapterFile from './adapter.file';
import AdapterMongo from './adapter.mongo';
import PortRepository from './repository';

@Service()
class PortRepositoryFactory {
  createRepositoryLocal(): PortRepository {
    return new PortRepository(Container.get(AdapterFile));
  }

  createRepositoryCompose(): PortRepository {
    return new PortRepository(Container.get(AdapterMongo));
  }
}

export default PortRepositoryFactory;
