import formatErrors from '../formatErrors';

export default {
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      console.log('user: ', user);
      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          ok: true,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
  },
};
