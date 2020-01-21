import path from 'path';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { refreshTokens } from './auth';
import { indexPage, addUser } from './controllers';
import schema from './schema';
import models from './models';
import app from './app';

require('dotenv').config();

const PORT = process.env.PORT;

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

const SECRET = process.env.SECRET;
const SECRET2 = process.env.SECRET2;

const ws = createServer(app);

/**
 * Creates database if not already created.
 * To recreate database add {force: true} to sync().
 */
models.sequelize.sync().then(() => {
  ws.listen(PORT, () => {
    console.log(`\nThe server has started on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/graphiql`);
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams, webSocket) => {
          const { token, refreshToken } = connectionParams;

          if (token && refreshToken) {
            try {
              const { user } = jwt.verify(token, SECRET);

              return { user, models };
            } catch (err) {
              const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);

              return { user: newTokens.user, models };
            }
          }

          return { models };
        },
        reconnect: true,
      },
      {
        server: ws,
        reconnect: true,
        path: '/subscriptions',
      },
    );
  });
});
