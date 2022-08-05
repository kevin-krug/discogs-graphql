import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { discogsService } from '../src/services/discogsService.js';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const types = readFileSync(require.resolve('../build/types.graphql')).toString('utf-8')

const app = express();

const rootQuerytype = `
schema {
  query: RootQuery
}

type RootQuery {
  release: Release
}`
;

const resolvers = {
  RootQuery: {
    release: async(parentValue, {id = '249504'}, context) => {
      return discogsService.get(`releases/${id}`)
    }
  }
}

const typeDefs = [rootQuerytype, types];

const schema = makeExecutableSchema({
	typeDefs,
  resolvers
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);
 
app.listen(4000);