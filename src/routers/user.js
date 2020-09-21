import { Router } from 'express';
import { User } from '../controllers';

import {
  extractCredentialsFromAuthorization,
  generateResponse,
  RESPONSE_CODES,
  RESPONSE_TYPES,
} from '../constants';

import { requireAuth } from '../middleware';

const userRouter = Router();

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
          user: isAuthed.user,
        }));
      } else {
        res.status(RESPONSE_CODES.UNAUTHORIZED.status).send(generateResponse(RESPONSE_TYPES.UNAUTHORIZED, 'Incorrect credentials'));
      }
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// given JSON body of user info, create user object
userRouter.route('/sign-up')
  .post(async (req, res) => {
    try {
      const result = await User.createUser(req.body);

      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, result));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// given id of user in header, get user info
userRouter.route('/:id')
  .get(requireAuth, async (req, res) => {
    try {
      const result = await User.getUserById(req.params.id);

      if (result && result.status === 200) {
        res.send(generateResponse(RESPONSE_TYPES.SUCCESS, result.user));
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
