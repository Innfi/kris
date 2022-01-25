import { Service } from 'typedi';
import winston from 'winston';
import { 
  ElasticsearchTransport, 
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';

@Service()
class TradyLogger {
  protected esTransportOptions: ElasticsearchTransportOptions = {
    level: 'info',
    clientOpts: { node: 'http://es-server:9200' }
  };
  protected esTransport = new ElasticsearchTransport(this.esTransportOptions);

  logger: Readonly<winston.Logger> = winston.createLogger({
    transports: [ this.esTransport ],
  });
}

export default TradyLogger;