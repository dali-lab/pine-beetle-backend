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

const summarizedRDRouter = Router();

// query items in collection
summarizedRDRouter.route('/')
  .get(async (req, res) => {
    const validQueryFields = [
      'rangerDistrict',
      'state',
      'year',
      'federalNameOld',
      'federalNameOlder',
      'hasSPBTrapping',
      'isValidForPrediction',
      'hasSpotst0',
      'hasPredictionAndOutcome',
      'endobrev',
      'totalTrappingDays',
      'trapCount',
      'daysPerTrap',
      'spbCount',
      'spbPer2Weeks',
      'spbPer2WeeksOrig',
      'cleridsPer2Weeks',
      'cleridst1',
      'spotst0',
      'spotst1',
      'spotst2',
      'pi',
      'mu',
      'expSpotsIfOutbreak',
      'probSpotsGT0',
      'probSpotsGT20',
      'probSpotsGT50',
      'probSpotsGT150',
      'probSpotsGT400',
      'probSpotsGT1000',
      'ln(spbPer2Weeks+1)',
      'ln(cleridsPer2Weeks+1)',
      'ln(spotst0+1)',
      'logit(Prob>50)',
      'predSpotslogUnits',
      'predSpotsorigUnits',
      'residualSpotslogUnits',
    ];

    const { startYear, endYear } = req.query;

    // explicitly sets query for start and end year
    const query = {
      ...req.query,
      ...(startYear && !endYear ? { year: { $gte: startYear } } : {}),
      ...(!startYear && endYear ? { year: { $lte: endYear } } : {}),
      ...(startYear && endYear ? { year: { $gte: startYear, $lte: endYear } } : {}),
    };

    try {
      const items = await queryFetch(COLLECTION_NAMES.summarizedRangerDistrict, query, validQueryFields);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// user specified query (allows for mongo-specific syntax)
summarizedRDRouter.route('/query')
  .post(async (req, res) => {
    try {
      const items = await specifiedQueryFetch(COLLECTION_NAMES.summarizedRangerDistrict, req.body);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default summarizedRDRouter;
