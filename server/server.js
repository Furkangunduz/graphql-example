import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { getUser } from './db/users.js';
import { resolvers } from './resolvers.js';

const PORT = 9000;

const typeDefs = await readFile('./schema.graphql', 'utf-8');

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

async function getContext({ req }) {
  const id = req?.auth?.sub;
  const user = id ? await getUser(id) : null;

  return {
    auth: req?.auth ?? null,
    user,
  };
}

app.use(cors(), express.json(), authMiddleware);
app.post('/login', handleLogin);

app.use('/graphql', expressMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL server ready at http://localhost:${PORT}/graphql`);
});
