import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import env from 'node-env-file';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import jwt from 'jsonwebtoken';

import { refreshTokens } from './auth';
import models from './models';

if ( process.env.NODE_ENV === 'development' ) {
  env(__dirname + '/../.env');
}

const SECRET = process.env.SECRET;
const SECRET2 = process.env.SECRET2;

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const nodeEnv = process.env.NODE_ENV;
const reactApp = (nodeEnv === 'development') ?  '/static/js/bundle.js' : '/static/js/main.min.js';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.locals.title = 'Slack Clone';
app.locals.content = 'A Slack clone using Express, GarphQL, and React.';
app.locals.reactApp = reactApp;
app.locals.env = process.env;

const PORT = 8081 || process.env;

const addUser = async(req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);

      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);

const graphqlEndpoint = '/graphql';

app.use(
	graphqlEndpoint,
	bodyParser.json(),
	graphqlExpress(req => ({
		schema,
		context: {
			models,
			user: req.user,
      SECRET,
      SECRET2
		}
	}))
);

app.use('/static', express.static('public'));

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));

app.use('/', (req, res) => {
  res.render('index', {
    title: req.app.locals.title,
    content: req.app.locals.content,
    path: req.path,
  });
});

/**
 * Creates database if not already created.
 * To recreate database add {force: true} to sync().
 */
models.sequelize.sync().then(() => {
	app.listen(PORT, () => {
	  console.log(`\nThe server has started on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
	  console.log(`http://localhost:${PORT}${graphqlEndpoint}`);
    console.log(`http://localhost:${PORT}/graphiql`);
	});
});
