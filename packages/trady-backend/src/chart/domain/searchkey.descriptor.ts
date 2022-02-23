import { TimestampType } from '../model';

export interface SearchKeyUnit {
  timestampType: TimestampType;
  keyName: string;
}

export type SearchKeyDict = {
  [timestampType in TimestampType]: SearchKeyUnit;
};
