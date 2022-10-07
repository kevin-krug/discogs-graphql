import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { toSchema, toSDLString } from './utils/index.js';

const TEST_RELEASE_ID = '249504';
const TEST_ARTIST_ID = '108713';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getJson = async (endpoint, id) => {
  let res = await axios(`https://api.discogs.com/${endpoint}/${id}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'discogs-graphql/1.0.0',
    },
  });
  return res.data;
};

const artistJson = await getJson('artists', TEST_ARTIST_ID );
const releaseJson = await getJson('releases', TEST_RELEASE_ID);

const artistSchema = toSchema(artistJson);
const releaseSchema = toSchema(releaseJson);

const buildDir = __dirname + '/../build';

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

const ArtistType = `${toSDLString(artistSchema, 'Artist')}`;
const ReleaseType = `${toSDLString(releaseSchema, 'Release')}`;

const output = `${ArtistType}${ReleaseType}`;

fs.writeFile(buildDir + '/types.graphql', output, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`
    types saved to /types.graphql`);
});
