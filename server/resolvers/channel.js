import formatErrors from '../formatErrors';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const team = await models.Team.findOne({ where: { id: args.teamId } }, { raw: true });
        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [
              {
                path: 'name',
                message: 'You have to be the owner of the team to create channels',
              },
            ],
          };
        }

        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
