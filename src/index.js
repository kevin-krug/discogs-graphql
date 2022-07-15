const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt } = require('graphql');
const { discogsService } = require('../src/services/discogsService');

const app = express();

// GraphQL schema
const ReleaseType = new GraphQLObjectType({
  fields: () => {
    return {
      id: { type: GraphQLInt },
      year: { type: GraphQLInt }
    }
  },
  name: 'ReleaseType'
});
const RootQuery = new GraphQLObjectType(
  {
    fields: () => ({
      release: {
        type: ReleaseType,
        args: {
          id: {
            type: GraphQLString 
          }
        },
        resolve: async(parentValue, {id = '249504'}, context) => {
          return discogsService.get(`releases/${id}`)
        }
      }
    }),
    name: 'RootQuery'
  }
)
const schema = new GraphQLSchema({
	query: RootQuery
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);
 
app.listen(4000);