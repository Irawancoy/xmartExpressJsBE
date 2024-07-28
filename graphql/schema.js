const { GraphQLSchema } = require('graphql');
const RootQuery = require('../graphql/queries/query'); // Mengimpor RootQuery yang telah didefinisikan
const RootMutation = require('../graphql/mutations/mutation'); // Mengimpor RootMutation yang telah didefinisikan

// Membuat skema GraphQL baru dengan query dan mutation root
const schema = new GraphQLSchema({
   query: RootQuery, // Menetapkan RootQuery sebagai query root
   mutation: RootMutation // Menetapkan RootMutation sebagai mutation root
});

module.exports = schema; // Mengekspor skema untuk digunakan di tempat lain dalam aplikasi
