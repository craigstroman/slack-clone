import formatErrors from '../formatErrors';
import requiresAuth from '../permissions';
import shortid from 'shortid';

export default {
  Query: {
    /**
     * Get's the team members.
     */
    getTeamMembers: requiresAuth.createResolver(async (parent, { teamId }, { models }) => {
      return models.sequelize.query(
        'select * from users as u join members as m on m.user_id = u.id where m.team_id = ?',
        {
          replacements: [teamId],
          model: models.User,
          raw: true,
        },
      )
    }),
  },
  Mutation: {
    /**
     * Allows a user to invite a user to a team.
     */
    addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
      try {
        const memberPromise = models.Member.findOne(
          { where: { teamId, userId: user.id } },
          { raw: true },
        );
        const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });
        const [member, userToAdd] = await Promise.all([memberPromise, userToAddPromise]);
        if (!member.admin) {
          return {
            ok: false,
            errors: [{ path: 'email', message: 'You cannot add members to the team' }],
          };
        }
        if (!userToAdd) {
          return {
            ok: false,
            errors: [{ path: 'email', message: 'Could not find user with this email' }],
          };
        }
        await models.Member.create({ userId: userToAdd.id, teamId });
        return {
          ok: true,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
    /**
     * Creates a team.
     */
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const response = await models.sequelize.transaction(async () => {
          args['uuid'] = shortid.generate();

          const team = await models.Team.create({ ...args });

          await models.Channel.create({ uuid: shortid.generate(), name: 'general', public: true, teamId: team.id });

          await models.Member.create({ teamId: team.id, userId: user.id, admin: true });

          return team;
        });

        return {
          ok: true,
          team: response,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
    directMessageMembers: ({ id }, args, { models, user }) => {
      return models.sequelize.query(
        'select distinct on (u.id) u.id, u.uuid, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId',
        {
          replacements: { currentUserId: user.id, teamId: id },
          model: models.User,
          raw: true,
        }
      );
    },
  },
};
