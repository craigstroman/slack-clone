import { tryLogin } from '../auth';
import formatErrors from '../formatErrors';
import requiresAuth from '../permissions';
import shortid from 'shortid';

export default {
  User: {
    teams: (parent, args, { models, user }) =>
      models.sequelize.query(
        'select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?',
        {
          replacements: [user.id],
          model: models.Team,
          raw: true,
        },
      ),
  },
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    me: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.User.findOne({ where: { id: user.id } })),
  },
  Mutation: {
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) => {
      return tryLogin(email, password, models, SECRET, SECRET2);
    },
    register: async (parent, args, { models }) => {
      try {
        args['uuid'] = shortid.generate();

        const user = await models.User.create(args);

        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
