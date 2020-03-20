import moment from 'moment';
import axios from 'axios';
import readXlsxFile from 'read-excel-file'
import Helpers from '../lib/Helpers';

interface TestEvent {
  date?: string;
}

interface Response {
  retry: boolean;
  data: BlobPart[];
}

async function getData(date: string, extension: string): Promise<Response> {
  try {
    const url = `https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-${date}.${extension}`;
    console.log(`REQUESTING ${url}`);
    const response = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
    });

    return {
      retry: false,
      data: response.data,
    };
  } catch (error) {
    console.error('ERROR', error.response);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 404) {
        // Try again with different format
        return {
          retry: true,
          data: null,
        }
      }
    }

    throw error;
  }
}

export async function handler(event?: TestEvent): Promise<boolean> {
  const {client} = await Helpers.prepareLambda();
  const date = event?.date ?? moment().format('YYYY-MM-DD');
  let response = await getData(date, 'xlsx');
  // Try again but with xls
  if (response.retry) {
    response = await getData(date, 'xls');
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
      DO NOTHING;
    `;
    await client.query(query);
  }

  await client.end();
  return true;
}
