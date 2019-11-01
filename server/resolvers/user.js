import { tryLogin } from '../auth';
import formatErrors from '../formatErrors';
import requiresAuth from '../permissions';
import shortid from 'shortid';

export default {
  User: {
    /**
     * Get's the teams.
     *
     * @param      {Object}  parent       The parent.
     * @param      {Object}  args         The arguments.
     * @param      {Object}  models       The models.
     * @param      {Object}  user         The user.
     */
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
    /**
     * Get's all users.
     *
     * @param      {<type>}  parent       The parent.
     * @param      {<type>}  args         The arguments.
     * @param      {Object}  models       The models.
     */
    allUsers: (parent, args, { models }) => models.User.findAll(),
    me: requiresAuth.createResolver((parent, args, { user, models }) =>
      models.User.findOne({ where: { id: user.id } })),
  },
  Mutation: {
    /**
     * Logs a user in.
     *
     * @param      {Object}  parent         The parent
     * @param      {String}  email          The email.
     * @param      {String}  password       The password.
     * @param      {Object}  models         The models.
     * @param      {String}  SECRET         The secret.
     * @param      {String}  SECRET2        The secret 2.
     */
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) => {
      const loginResult = await tryLogin(email, password, models, SECRET, SECRET2);
      let result = null;
      let teams = null;
      let team = null;
      let channelUUID = null;

      if (loginResult.ok) {
        try {
          teams = await models.sequelize.query(
            'select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?',
            {
              replacements: [loginResult.userInfo.id],
              model: models.Team,
              raw: true,
            },
          );

          team = teams[0];

          const channel = await models.sequelize.query(
            "select uuid from channels where channels.name = 'general' and channels.team_id = ?",
            {
              replacements: [team.id],
              model: models.Channels,
              raw: true,
            }
          );

          channelUUID = channel[0][0].uuid;
        } catch (err) {
          console.log(`There was an error: ${err}`);

          teams = [];
          team = '';
          channelUUID = '';
        }


        if (Array.isArray(teams)) {
          if (teams.length >= 1) {
            result = {
              'ok': loginResult.ok,
              'user': loginResult.user,
              'teamUUID': team.uuid,
              'channelUUID': channelUUID,
              'token': loginResult.token,
              'refreshToken': loginResult.refreshToken,
            }
          } else {
            result = {
              'ok': loginResult.ok,
              'user': loginResult.user,
              'teamUUID': undefined,
              'token': loginResult.token,
              'refreshToken': loginResult.refreshToken,
            }
          }
        } else {
          result = {
              'ok': loginResult.ok,
              'user': loginResult.user,
              'teamUUID': undefined,
              'token': loginResult.token,
              'refreshToken': loginResult.refreshToken,
            }
        }
      } else {
        result = {
          'ok': loginResult.ok,
          'user': loginResult.user,
          'teamUUID': undefined,
          'token': loginResult.token,
          'refreshToken': loginResult.refreshToken,
        }
      }

      return result;
    },
    /**
     * Registers a user.
     *
     * @param      {Object}  parent       The parent.
     * @param      {Object}  args         The arguments.
     * @param      {Object}  models       The models.
     */
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
