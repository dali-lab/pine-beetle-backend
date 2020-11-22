import { Router } from 'express';
import { User } from '../controllers';

import {
  extractCredentialsFromAuthorization,
  generateResponse,
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
} from '../constants';

import {
  queryFetch,
} from '../utils';

import { requireAuth } from '../middleware';

const userRouter = Router();

// get all users
userRouter.route('/')
  .get(requireAuth, async (_req, res) => {
    try {
      const items = await queryFetch(COLLECTION_NAMES.users);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// given email and password in authorization header, return auth token
userRouter.route('/login')
  .get(async (req, res) => {
    // ensure provided authorization headers
    if (!req.headers.authorization) {
      res.status(RESPONSE_CODES.UNAUTHORIZED.status).send(
        generateResponse(
          RESPONSE_TYPES.UNAUTHORIZED,
          'Must provide authorization header with basic auth (email and password)',
        ),
      );
    }

    const credentials = extractCredentialsFromAuthorization(req.headers.authorization);

    try {
      const isAuthed = await User.isAuthedUser(credentials);

      if (isAuthed.result) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, {
          token: User.tokenForUser(credentials.email),
          user: {
            ...isAuthed.user._doc,
            salted_password: undefined,
          },
        }));
      } else {
        res.status(RESPONSE_CODES.UNAUTHORIZED.status).send(generateResponse(RESPONSE_TYPES.UNAUTHORIZED, {
          message: 'Incorrect credentials',
        }));
      }
    } catch (error) {
      if (error.toString() === 'Error: NOT_FOUND') {
        res.status(RESPONSE_CODES.UNAUTHORIZED.status).send(generateResponse(RESPONSE_TYPES.UNAUTHORIZED, {
          message: 'Incorrect credentials',
        }));
      } else {
        res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
          generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
        );
      }
    }
  });

// given JSON body of user info, create user object
// MUST BE USER TO CREATE ANOTHER USER -- THIS IS AN ADMIN ACTION
userRouter.route('/sign-up')
  .post(requireAuth, async (req, res) => {
    try {
      const { email } = req.body;

      const userAlreadyExists = await User.userWithEmailExists(email);

      if (userAlreadyExists) {
        return res.status(RESPONSE_CODES.BAD_REQUEST.status)
          .send(generateResponse(RESPONSE_TYPES.BAD_REQUEST, {
            message: 'Please sign up with a different email',
          }));
      }

      const user = await User.createUser(req.body);

      return res.send(generateResponse(RESPONSE_TYPES.SUCCESS, {
        token: User.tokenForUser(req.body.email),
        user: {
          ...user._doc,
          salted_password: undefined,
        },
      }));
    } catch (error) {
      console.log(error);

      return res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// check that user auth header is valid (middleware will send 401 if invalid)
userRouter.route('/auth')
  .get(requireAuth, async (_req, res) => {
    res.send(generateResponse(RESPONSE_TYPES.SUCCESS));
  });

userRouter.route('/:id')
  // given id of user in header, get user info
  .get(requireAuth, async (req, res) => {
    try {
      const result = await User.getUserById(req.params.id);

      if (result && result.status === 200) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, {
          ...result.user._doc,
          salted_password: undefined,
        }));
      } else {
        res.status(result.status || 500).send(
          generateResponse(result.type),
        );
      }
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  })
  // given id of user in header, update user info
  .put(requireAuth, async (req, res) => {
    try {
      const result = await User.updateUser(req.params.id, req.body);

      if (result && result.status === 200) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, {
          ...result.user._doc,
          salted_password: undefined,
        }));
      } else {
        res.status(result.status || 500).send(
          generateResponse(result.type),
        );
      }
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  })
  // given id of user in header, delete user
  .delete(requireAuth, async (req, res) => {
    try {
      const result = await User.deleteUser(req.params.id);

      if (result && result.status === 200) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS));
      } else {
        res.status(result.status || 500).send(
          generateResponse(result.type),
        );
      }
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default userRouter;
