import moment from 'moment';
import axios from 'axios';
import readXlsxFile from 'read-excel-file'
import Helpers from '../lib/Helpers';

interface TestEvent {
  date?: string;
}

interface Response {
  status: number;
  data: BlobPart[];
}

async function getData(date: string, extension?: string): Promise<Response> {
  try {
    const url = `https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-${date}.${extension || 'xlsx'}`;
    console.log(`REQUESTING ${url}`);
    const response = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
    });

    return {
      status: 200,
      data: response.data,
    };
  } catch (error) {
    console.error('ERROR', error.response);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 404) {
        // Try again with different format
        if (!extension) {
          return await getData(date, 'xls');
        }

        return {
          status: 404,
          data: null,
        }
      }
    }

    throw error;
  }
}

export async function handler(event?: TestEvent): Promise<boolean> {
  const {connection} = await Helpers.prepareLambda();
  const date = event?.date ?? moment().format('YYYY-MM-DD');
  const response = await getData(date);
  // Try again but with xls
  if (response.status === 404) {
    // response = await getData(date, 'xls');
    return false;
  }
  const { data } = response;
  const xls: string[][] = await readXlsxFile(data);
  xls.shift();
  // Remove first column with just name information
  for (const [isoDate, day, month, year, cases, deaths, country, geoId] of xls) {
    console.log(isoDate, day, month, year, cases, deaths, country, geoId);
    if (geoId.length > 2) {
      continue;
    }

    const query = `
      INSERT INTO covid19.cases (date, cases, deaths, country, geo_id)
      VALUES ('${moment(isoDate).format('YYYY-MM-DD')}', '${cases}', '${deaths}', '${country}', '${geoId}')
      ON CONFLICT ON CONSTRAINT cases_pk_2
      DO UPDATE SET cases = EXCLUDED.cases, deaths = EXCLUDED.deaths
    `;
    await connection.manager.query(query);
  }

  await connection.close();
  return true;
}
