import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';


const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

import models from './models';

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

const graphqlEndpoint = '/graphql';

const PORT = 8081 || process.env;

app.use(
	graphqlEndpoint,
	bodyParser.json(),
	graphqlExpress({
		schema,
		context: {
			models,
			user: {
				id: 1,
			}
		}
	})
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
models.sequelize.sync({force: true}).then(() => {
	app.listen(PORT, () => {
	  console.log(`\nThe server has started on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
	  console.log(`http://localhost:${PORT}${graphqlEndpoint}`);
    console.log(`http://localhost:${PORT}/graphiql`);
	});
});
