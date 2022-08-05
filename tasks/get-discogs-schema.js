import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { toSchema, toSDLString } from './utils/index.js';

const TEST_RELEASE_ID = '249504';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getReleaseJson = async (id = TEST_RELEASE_ID) => {
  let res = await axios(`https://api.discogs.com/releases/${id}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'discogs-graphql/1.0.0',
    },
  });

  return res.data;
};

const releaseJson = await getReleaseJson();

const releaseSchema = toSchema(releaseJson);

const buildDir = __dirname + '/../build';

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

const ReleaseType = `${toSDLString(releaseSchema, 'Release')}`;

const output = `${ReleaseType}`;

fs.writeFile(buildDir + '/types.graphql', output, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`
    types saved to /types.graphql`);
});
