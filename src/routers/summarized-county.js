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
  generateStatePipeline,
  generateYearPipeline,
  generateYearListPipeline,
  generateStateListPipeline,
  generateLocationListPipeline,
  specifiedQueryFetch,
  queryFetch,
} from '../utils';

const summarizedCountyRouter = Router();

// query items in collection
summarizedCountyRouter.route('/')
  .get(async (req, res) => {
    const validQueryFields = [
      'county',
      'state',
      'year',
      'FIPS',
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
      const items = await queryFetch(COLLECTION_NAMES.summarizedCounty, query, validQueryFields);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// user specified query (allows for mongo-specific syntax)
summarizedCountyRouter.route('/query')
  .post(async (req, res) => {
    try {
      const items = await specifiedQueryFetch(COLLECTION_NAMES.summarizedCounty, req.body);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// sum up values, grouped by year
summarizedCountyRouter.route('/aggregate/year')
  .get(async (req, res) => {
    const {
      county,
      endYear,
      startYear,
      state,
    } = req.query;

    const pipeline = generateYearPipeline(
      'county',
      parseInt(startYear, 10),
      parseInt(endYear, 10),
      state,
      county,
    );

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedCounty, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// sum up values, grouped by state
summarizedCountyRouter.route('/aggregate/state')
  .get(async (req, res) => {
    const {
      county,
      endYear,
      startYear,
      state,
    } = req.query;

    const pipeline = generateStatePipeline(
      'county',
      parseInt(startYear, 10),
      parseInt(endYear, 10),
      state,
      county,
    );

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedCounty, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// sum up values, grouped by county
summarizedCountyRouter.route('/aggregate/county')
  .get(async (req, res) => {
    const {
      county,
      endYear,
      startYear,
      state,
    } = req.query;

    const pipeline = generateLocationPipeline(
      'county',
      parseInt(startYear, 10),
      parseInt(endYear, 10),
      state,
      county,
    );

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedCounty, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

// get list of available years in database
summarizedCountyRouter.route('/years/list')
  .get(async (req, res) => {
    const {
      county,
      isHistorical,
      isPrediction,
      state,
    } = req.query;

    const pipeline = generateYearListPipeline('county', {
      isHistorical,
      isPrediction,
      loc: county,
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedCounty, pipeline);
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
summarizedCountyRouter.route('/states/list')
  .get(async (req, res) => {
    const {
      endYear,
      isHistorical,
      isPrediction,
      startYear,
    } = req.query;

    const pipeline = generateStateListPipeline('county', {
      endYear: endYear ? parseInt(endYear, 10) : undefined,
      isHistorical,
      isPrediction,
      startYear: startYear ? parseInt(startYear, 10) : undefined,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedCounty, pipeline);
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

// get list of available counties in database for given  year
summarizedCountyRouter.route('/counties/list')
  .get(async (req, res) => {
    const {
      endYear,
      isHistorical,
      isPrediction,
      startYear,
      state,
    } = req.query;

    const pipeline = generateLocationListPipeline('county', {
      endYear: endYear ? parseInt(endYear, 10) : undefined,
      isHistorical,
      isPrediction,
      startYear: startYear ? parseInt(startYear, 10) : undefined,
      state,
    });

    try {
      const items = await aggregate(COLLECTION_NAMES.summarizedCounty, pipeline);
      res.send(generateResponse(RESPONSE_TYPES.SUCCESS, items.map(({ county }) => {
        return county;
      })));
    } catch (error) {
      console.log(error);

      res.status(RESPONSE_CODES.INTERNAL_ERROR.status).send(
        generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error),
      );
    }
  });

export default summarizedCountyRouter;
