import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { indexPage, addUser } from './controllers';
import schema from './schema';
import models from './models';

require('dotenv').config();

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const SECRET2 = process.env.SECRET2;
const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;

const reactApp = process.env.NODE_ENV === 'development' ? '/static/js/bundle.js' : '/static/js/main.min.js';

const app = express();

app.use(cors('*'));

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.dev');
  const webpackCompiler = webpack(webpackConfig);

  app.use(
    require('webpack-dev-middleware')(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    }),
  );

  app.use(
    require('webpack-hot-middleware')(webpackCompiler, {
      path: '/__webpack_hmr',
    }),
  );
}

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.locals.title = 'Slack Clone';
app.locals.content = 'A Slack clone using Express, GarphQL, and React.';
app.locals.reactApp = reactApp;
app.locals.env = process.env;

app.use(addUser);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: graphqlEndpoint,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }),
);

app.use(
  graphqlEndpoint,
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      context: {
        user: req.user,
        models,
        SECRET,
        SECRET2,
      },
    };
  }),
);

app.use('/static', express.static('public'));

app.use('/', indexPage);

export default app;
