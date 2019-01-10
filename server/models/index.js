import Sequelize from 'sequelize';
import env from 'node-env-file';

if ( process.env.NODE_ENV === 'development' ) {
  env(__dirname + '/../../.env');
}

const db = process.env.DB;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;


const sequelize = new Sequelize(db, dbUser, dbPassword, {
  dialect: 'postgres',
  define: {
  	underscored: true,
  },
});

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
