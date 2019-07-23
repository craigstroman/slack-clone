import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

/**
 * Creates the auth tokens.
 *
 * @param      {String}  user     The user.
 * @param      {String}  secret   The secret.
 * @param      {String}  secret2  The secret 2.
 */
export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'username']),
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user,  ['id', 'username']),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken];
};

/**
 * Refreshes a users auth tokens.
 *
 * @param      {String}  token         The token.
 * @param      {String}  refreshToken  The refresh token.
 * @param      {Object}  models        The models.
 * @param      {String}  SECRET        The secret.
 */
export const refreshTokens = async (token, refreshToken, models, SECRET) => {
  let userId = -1;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  try {
    jwt.verify(refreshToken, user.refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, user.refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

/**
 * Logs a user in.
 *
 * @param      {String}  email     The email.
 * @param      {String}  password  The password.
 * @param      {Object}  models    The models.
 * @param      {String}  SECRET    The secret.
 * @param      {String}  SECRET2   The secret 2.
 */
export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true })

  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{ path: '', message: 'Invalid email or password.' }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: '', message: 'Invalid email or password.' }],
    };
  }

  const refreshTokenSecret = user.password + SECRET2;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

  return {
    'userInfo': user,
    ok: true,
    token,
    refreshToken,
  };
};
