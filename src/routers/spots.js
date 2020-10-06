import { Router } from 'express';

import {
  generateResponse,
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
} from '../constants';

import {
  queryFetch,
} from '../utils';

const unsummarizedRouter = Router();

// query items in collection
unsummarizedRouter.route('/')
  .get(async (req, res) => {
    const validQueryFields = [
      'county',
      'fips',
      'hostAc',
      'rangerDistrict',
      'spbCount',
      'state',
      'year',
    ];

    try {
      const items = await queryFetch(COLLECTION_NAMES.spots, req.query, validQueryFields);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default unsummarizedRouter;
