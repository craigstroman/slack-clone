import bcrypt from 'bcrypt';
import formatErrors from '../formatErrors';
import { tryLogin } from '../auth';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (parent, { password, ...otherArgs }, {models}) => {
      try {
        if (password.length < 5 || password.length > 100) {
          return {
            ok: false,
            errors: [
              {
                path: 'password',
                message: 'The password needs to be between 5 and 100 characters long.',
              },
            ],
          };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        console.log('Ok, user created.');
        console.log({ ...otherArgs, password: hashedPassword });

        const user = await models.User.create({ ...otherArgs, password: hashedPassword });
        return {
          ok: true,
          user,
        };
      } catch(e) {
        console.log(formatErrors(e, models));
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    }
  },
};
