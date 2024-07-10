const { GraphQLSchema } = require('graphql')
const RootQuery = require('../graphql/queries/query')
const RootMutation = require('../graphql/mutations/mutation')

const schema = new GraphQLSchema({
   query: RootQuery,
   mutation: RootMutation
})

module.exports = schema;