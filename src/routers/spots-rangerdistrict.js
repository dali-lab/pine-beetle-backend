import { Router } from 'express';

import {
  generateResponse,
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
} from '../constants';

import {
  specifiedQueryFetch,
  queryFetch,
} from '../utils';

const unsummarizedRouter = Router();

// query items in collection
unsummarizedRouter.route('/')
  .get(async (req, res) => {
    const validQueryFields = [
      'rangerDistrict',
      'spots',
      'state',
      'year',
    ];

    try {
      const items = await queryFetch(COLLECTION_NAMES.spotsRangerDistrict, req.query, validQueryFields);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// user specified query (allows for mongo-specific syntax)
unsummarizedRouter.route('/query')
  .post(async (req, res) => {
    try {
      const items = await specifiedQueryFetch(COLLECTION_NAMES.spotsRangerDistrict, req.body);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default unsummarizedRouter;
