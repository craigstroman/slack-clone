const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

let loggedInUser = null;

// requiresAuth
export default createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }

  loggedInUser = user;
});

// requiresTeamAccess
export const requiresTeamAccess = createResolver(async (parent, { channelId }, { models, user })  => {
  if ((!user || !user.id) && (!loggedInUser || !loggedInUser.id)) {
    throw new Error('Not authenticated.');
  }

  if (user === undefined && typeof loggedInUser === 'object') {
    user = loggedInUser;
  }

  // Check if part of the team
  const channel = await models.Channel.findOne({ where: { id: channelId } });
  const member = await models.Member.findOne({
    where: { teamId: channel.teamId, userId: user.id },
  })

  if (!member) {
    throw new Error('You have to be a member of the team to subscribe to it\'s messages.');
  }
});
