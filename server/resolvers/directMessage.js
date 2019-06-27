import { PubSub, withFilter } from 'graphql-subscriptions';
import Sequelize from 'sequelize';
import requiresAuth, { directMessageSubscription } from '../permissions';

const pubsub = new PubSub();

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, {user}) =>
          payload.teamId === args.teamId &&
            ((payload.senderId === user.id && payload.receiverId === args.userId) ||
              (payload.senderId === args.userId && payload.receiverId === user.id)),
      )),
    }
  },
  DirectMessage: {
    sender: ({ sender, senderId }, args, {models}) => {
      if (sender) {
        return sender;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
  },
  Query: {
    directMessages: requiresAuth.createResolver(async (parent, { teamId, otherUserId }, { models, user }) => {
      const Op = Sequelize.Op;

      const result = await models.DirectMessage.findAll(
        {
          order: [['created_at', 'ASC']],
          where: {
            teamId,
            [Op.or]: [
              {
                [Op.and]: [{ receiverId: otherUserId }, { senderId: user.id }],
              },
              {
                [Op.and]: [{ receiverId: user.id }, { senderId: otherUserId }],
              },
            ],
          },
        },
        { raw: true },
      );

      return result;
    }),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const directMessage = await models.DirectMessage.create({
          ...args,
          senderId: user.id,
        });

        pubsub.publish(NEW_DIRECT_MESSAGE, {
          teamId: args.teamId,
          senderId: user.id,
          receiverId: args.receiverId,
          newDirectMessage: {
            ...directMessage.dataValues,
            sender: {
              username: user.username,
            },
          },
        });

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    })
  }
}
