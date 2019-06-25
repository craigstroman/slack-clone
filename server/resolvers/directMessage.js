import requiresAuth from '../permissions';
import Sequelize from 'sequelize';

export default {
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

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    })
  }
}
