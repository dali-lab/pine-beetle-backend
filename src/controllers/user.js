import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';

import { User } from '../models';
import { RESPONSE_CODES } from '../constants';

const { SALT_ROUNDS } = process.env;

/**
 * @description retrieves user object
 * @param {String} email email address of user
 * @returns {Promise<User>} promise that resolves to user object or error
 */
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (user) return user;
    return RESPONSE_CODES.NOT_FOUND;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 * @description retrieves user object
 * @param {String} id user id
 * @returns {Promise<User>} promise that resolves to user object or error
 */
export const getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    if (user) {
      return {
        ...RESPONSE_CODES.SUCCESS,
        user,
      };
    }
    return RESPONSE_CODES.NOT_FOUND;
  } catch (error) {
    console.log(error);
    return RESPONSE_CODES.NOT_FOUND;
  }
};

/**
 * @description creates user object in database
 * @param {Object} fields user info fields (email, first_name, and password required)
 * @returns {Promise<User>} promise that resolves to user object or error
 */
export const createUser = (fields) => {
  return new Promise((resolve, reject) => {
    const {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    } = fields;

    // ensure got required inputs
    if (!(email && firstName && password)) {
      reject(new Error({
        code: RESPONSE_CODES.BAD_REQUEST,
        error: { message: 'Please provide email, first_name, and password' },
      }));
    }

    // auto-gen salt and hash the user's password
    bcrypt.hash(password, SALT_ROUNDS, null, async (err, hash) => {
      if (err) {
        reject(new Error({ code: RESPONSE_CODES.INTERNAL_ERROR, error: err }));
      } else {
        const user = new User();

        user.first_name = firstName;
        user.last_name = lastName;
        user.email = email;
        user.salted_password = hash;

        try {
          const savedUser = await user.save();
          resolve(savedUser);
        } catch (error) {
          console.log(error);

          reject(new Error({
            code: RESPONSE_CODES.INTERNAL_ERROR,
            error,
          }));
        }
      }
    });
  });
};

/**
 * @description update user object
 * @param {String} id id of user to update
 * @param {String} fields fields for user to update
 * @returns {Promise<User>} promise that resolves to user object or error
 */
export const updateUser = (id, fields) => {
  return new Promise((resolve, reject) => {
    const {
      id: providedId,
      _id: providedUnderId,
      password,
    } = fields;

    // reject update of id
    if (providedId || providedUnderId) {
      reject(new Error({
        code: RESPONSE_CODES.BAD_REQUEST,
        error: { message: 'Cannot update user id' },
      }));
    }

    if (password) {
      // auto-gen salt and hash the user's password if they are changing it
      bcrypt.hash(password, SALT_ROUNDS, null, async (err, hash) => {
        if (err) {
          reject(new Error({ code: RESPONSE_CODES.INTERNAL_ERROR, error: err }));
        } else {
          try {
            // then save user
            await User.updateOne({ _id: id }, {
              ...fields,
              salted_password: hash,
            });

            const updatedUser = await getUserById(id);

            resolve({
              ...RESPONSE_CODES.SUCCESS,
              user: updatedUser.user,
            });
          } catch (error) {
            console.log(error);

            reject(new Error({
              code: RESPONSE_CODES.INTERNAL_ERROR,
              error,
            }));
          }
        }
      });
    } else {
      // if not updating password, just save now
      User.updateOne({ _id: id }, fields)
        .then(async () => {
          const updatedUser = await getUserById(id);

          resolve({
            ...RESPONSE_CODES.SUCCESS,
            user: updatedUser.user,
          });
        })
        .catch((error) => {
          console.log(error);

          reject(new Error({
            code: RESPONSE_CODES.INTERNAL_ERROR,
            error,
          }));
        });
    }
  });
};

/**
 * @description deletes user with given id
 * @param {String} id user id
 * @returns {Promise<User>} promise that resolves to success object or error
 */
export const deleteUser = async (id) => {
  try {
    await User.deleteOne({ _id: id });
    return RESPONSE_CODES.SUCCESS;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 * @description salts and hashes provided password and compares with salted_password for user in database
 * @param {Object} credentials credentials object with email and password field
 * @returns {Promise<Object>} promise that resolves to object with result field of authenticated and user if authed
 */
export const isAuthedUser = (credentials) => {
  return new Promise((resolve, reject) => {
    getUserByEmail(credentials.email)
      .then((user) => {
        if (!user) reject(new Error(RESPONSE_CODES.INTERNAL_ERROR.type));

        if (user.salted_password) {
          bcrypt.compare(credentials.password, user.salted_password, (err, result) => {
            if (err) {
              reject(new Error(RESPONSE_CODES.INTERNAL_ERROR.type));
            } else {
              // explicit check to only evaluate boolean
              // (will false a null/undefined instead of returning null/undefined)
              resolve({
                result: result === true,
                ...result === true ? { user } : {},
              });
            }
          });
        } else {
          reject(new Error(RESPONSE_CODES.INTERNAL_ERROR.type));
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

/**
 * @description generates auth token for given user
 * @param {String} email email address of user
 */
export const tokenForUser = (email) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: email, iat: timestamp }, process.env.AUTH_SECRET);
};
