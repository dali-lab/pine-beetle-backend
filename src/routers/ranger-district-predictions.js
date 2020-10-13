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

const rangerDistrictPredictionsRouter = Router();

// query items in collection
rangerDistrictPredictionsRouter.route('/')
  .get(async (req, res) => {
    const validQueryFields = [
      'cleridPerDay',
      'rangerDistrict',
      'spbPerDay',
      'state',
      'trapCount',
      'year',
    ];

    try {
      const items = await queryFetch(COLLECTION_NAMES.predictionsRangerDistrict, req.query, validQueryFields);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// user specified query (allows for mongo-specific syntax)
rangerDistrictPredictionsRouter.route('/query')
  .post(async (req, res) => {
    try {
      const items = await specifiedQueryFetch(COLLECTION_NAMES.predictionsRangerDistrict, req.body);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default rangerDistrictPredictionsRouter;
