import axios from 'axios';
import dotenv from 'dotenv';

import LoadChartInputBase from '../domain/input.base';

dotenv.config();

const referenceUrl = process.env.URL as string;
const apiKey = process.env.API_KEY as string;

const getDataFromReference = async (
  input: Readonly<LoadChartInputBase>,
): Promise<unknown> => {
  const url = input.toReferenceUrl(referenceUrl, apiKey);

  const response = await axios.get(url);

  return response.data;
};

export default getDataFromReference;
