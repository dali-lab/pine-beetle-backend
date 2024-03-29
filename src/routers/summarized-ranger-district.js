import { Router } from 'express';

import {
  generateResponse,
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
} from '../constants';

import {
  aggregate,
  generateLocationPipeline,
  generateSparsePipeline,
  generateStatePipeline,
  generateYearPipeline,
  generateYearListPipeline,
  generateStateListPipeline,
  generateLocationListPipeline,
  specifiedQueryFetch,
  queryFetch,
} from '../utils';

import {
  requireAuth,
} from '../middleware';

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
  .post(requireAuth, async (req, res) => {
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

// fetch only a few fields
summarizedRDRouter.route('/sparse')
  .get(async (req, res) => {
    const {
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = req.query;

    const pipeline = generateSparsePipeline('rangerDistrict', {
      endYear: parseInt(endYear, 10),
      loc: rangerDistrict,
      startYear: parseInt(startYear, 10),
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });
// sum up values, grouped by year
summarizedRDRouter.route('/aggregate/year')
  .get(async (req, res) => {
    const {
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = req.query;

    const pipeline = generateYearPipeline('rangerDistrict', {
      endYear: parseInt(endYear, 10),
      loc: rangerDistrict,
      startYear: parseInt(startYear, 10),
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// sum up values, grouped by state
summarizedRDRouter.route('/aggregate/state')
  .get(async (req, res) => {
    const {
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = req.query;

    const pipeline = generateStatePipeline('rangerDistrict', {
      endYear: parseInt(endYear, 10),
      loc: rangerDistrict,
      startYear: parseInt(startYear, 10),
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// sum up values, grouped by ranger district
summarizedRDRouter.route('/aggregate/rangerDistrict')
  .get(async (req, res) => {
    const {
      endYear,
      rangerDistrict,
      startYear,
      state,
    } = req.query;

    const pipeline = generateLocationPipeline('rangerDistrict', {
      endYear: parseInt(endYear, 10),
      loc: rangerDistrict,
      startYear: parseInt(startYear, 10),
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// get list of available years in database
summarizedRDRouter.route('/years/list')
  .get(async (req, res) => {
    const {
      isHistorical,
      isPrediction,
      rangerDistrict,
      state,
    } = req.query;

    const pipeline = generateYearListPipeline('rangerDistrict', {
      isHistorical,
      isPrediction,
      loc: rangerDistrict,
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items.map(({ year }) => {
        return year;
      })));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// get list of available states in database
summarizedRDRouter.route('/states/list')
  .get(async (req, res) => {
    const {
      endYear,
      isHistorical,
      isPrediction,
      startYear,
    } = req.query;

    const pipeline = generateStateListPipeline('rangerDistrict', {
      endYear: endYear ? parseInt(endYear, 10) : undefined,
      isHistorical,
      isPrediction,
      startYear: startYear ? parseInt(startYear, 10) : undefined,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items.map(({ state }) => {
        return state;
      })));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// get list of available ranger districts in database for given  year
summarizedRDRouter.route('/rangerDistricts/list')
  .get(async (req, res) => {
    const {
      endYear,
      isHistorical,
      isPrediction,
      startYear,
      state,
    } = req.query;

    const pipeline = generateLocationListPipeline('rangerDistrict', {
      endYear: endYear ? parseInt(endYear, 10) : undefined,
      isHistorical,
      isPrediction,
      startYear: startYear ? parseInt(startYear, 10) : undefined,
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedRangerDistrict, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items.map(({ rangerDistrict }) => {
        return rangerDistrict;
      })));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default summarizedRDRouter;
