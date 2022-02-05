/**
 * @description creates the $match stage of an aggregation pipeline
 * @param {String} location either 'county' or 'rangerDistrict'
 * @param {Number} [startYear] optional start year to filter on
 * @param {Number} [endYear] optional end year to filter on
 * @param {String} [state] optional state to filter on
 * @param {String} [loc] optional sublocation to filter on (name of county or ranger district)
 * @returns
 */
function createMatchStage(location, startYear, endYear, state, loc) {
  return {
    ...(startYear && !endYear ? { year: { $gte: startYear } } : {}),
    ...(!startYear && endYear ? { year: { $lte: endYear } } : {}),
    ...(startYear && endYear ? { year: { $gte: startYear, $lte: endYear } } : {}),
    ...(state ? { state: { $in: state.split(',') } } : {}),
    ...(loc ? { [location]: { $in: loc.split(',') } } : {}),
  };
}

/**
 * @description generates pipeline code for computing grouped fields
 * @returns {Object} output object for pipeline
 */
function createComputedFields() {
  return {
    avgSpbPer2Weeks: { $avg: '$spbPer2Weeks' },
    avgCleridsPer2Weeks: { $avg: '$cleridsPer2Weeks' },
    avgSpotst0: { $avg: '$spotst0' },
    sumSpbPer2Weeks: { $sum: '$spbPer2Weeks' },
    sumCleridsPer2Weeks: { $sum: '$cleridsPer2Weeks' },
    sumSpotst0: { $sum: '$spotst0' },
    minSpotst0: { $min: '$spotst0' },
    maxSpotst0: { $max: '$spotst0' },
  };
}

/**
 * @description specifies what computed fields to include in the project stage
 * @returns {Object} output object for pipeline
 */
function projectComputedFields() {
  return {
    avgSpbPer2Weeks: 1,
    avgCleridsPer2Weeks: 1,
    avgSpotst0: 1,
    sumSpbPer2Weeks: 1,
    sumCleridsPer2Weeks: 1,
    sumSpotst0: 1,
    minSpotst0: 1,
    maxSpotst0: 1,
  };
}

/**
   * @description generates a mongoDB aggregation pipeline by year
   * @param {String} location either 'county' or 'rangerDistrict'
   * @param {Number} [startYear] optional start year to filter on
   * @param {Number} [endYear] optional end year to filter on
   * @param {String} [state] optional state to filter on
   * @param {String} [loc] optional sublocation to filter on (name of county or ranger district)
   * @returns
   */
export function generateYearPipeline(location, startYear, endYear, state, loc) {
  return [
    {
      $match: createMatchStage(location, startYear, endYear, state, loc),
    },
    {
      $group: {
        _id: '$year',
        ...createComputedFields(),
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        year: '$_id',
        ...projectComputedFields(),
      },
    },
  ];
}

/**
   * @description generates a mongoDB aggregation pipeline by year
   * @param {String} location either 'county' or 'rangerDistrict'
   * @param {Number} [startYear] optional start year to filter on
   * @param {Number} [endYear] optional end year to filter on
   * @param {String} [state] optional state to filter on
   * @param {String} [loc] optional sublocation to filter on (name of county or ranger district)
   * @returns
   */
export function generateStatePipeline(location, startYear, endYear, state, loc) {
  return [
    {
      $match: createMatchStage(location, startYear, endYear, state, loc),
    },
    {
      $group: {
        _id: '$state',
        ...createComputedFields(),
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        state: '$_id',
        ...projectComputedFields(),
      },
    },
  ];
}

/**
   * @description generates a mongoDB aggregation pipeline by year
   * @param {String} location either 'county' or 'rangerDistrict'
   * @param {Number} [startYear] optional start year to filter on
   * @param {Number} [endYear] optional end year to filter on
   * @param {String} [state] optional state to filter on
   * @param {String} [loc] optional sublocation to filter on (name of county or ranger district)
   * @returns
   */
export function generateLocationPipeline(location, startYear, endYear, state, loc) {
  return [
    {
      $match: createMatchStage(location, startYear, endYear, state, loc),
    },
    {
      $group: {
        _id: {
          [location]: `$${location}`,
          state: '$state',
        },
        ...createComputedFields(),
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        [location]: `$_id.${location}`,
        state: '$_id.state',
        ...projectComputedFields(),
      },
    },
  ];
}

/**
 * @description generates a mongoDB aggregation pipeline to list all available years in data
 * @param {Object} [filters] optional filters for isHistorical and isPrediction
 */
export function generateYearListPipeline({ isHistorical, isPrediction }) {
  return [
    {
      $match: {
        ...(isHistorical ? { $or: [{ hasSPBTrapping: 1 }, { hasSpotst0: 1 }] } : {}),
        ...(isPrediction ? { isValidForPrediction: 1 } : {}),
      },
    },
    { $group: { _id: '$year' } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, year: '$_id' } },
  ];
}

/**
 * @description generates a mongoDB aggregation pipeline to list all available states in data
 * @param {Object} [filters] optional filters for isHistorical and isPrediction
 */
export function generateStateListPipeline({ isHistorical, isPrediction }) {
  return [
    {
      $match: {
        ...(isHistorical ? { $or: [{ hasSPBTrapping: 1 }, { hasSpotst0: 1 }] } : {}),
        ...(isPrediction ? { isValidForPrediction: 1 } : {}),
      },
    },
    { $group: { _id: '$state' } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, state: '$_id' } },
  ];
}

/**
 * @description generates a mongoDB aggregation pipeline to list all available counties or ranger districts in data
 * @param {String} location either 'county' or 'rangerDistrict'
 * @param {String} state state abbreviation to find available counties in
 * @param {Object} [filters] optional filters for isHistorical and isPrediction
 */
export function generateLocationListPipeline(location, state, { isHistorical, isPrediction }) {
  return [
    {
      $match: {
        ...(state ? { state } : {}),
        ...(isHistorical ? { $or: [{ hasSPBTrapping: 1 }, { hasSpotst0: 1 }] } : {}),
        ...(isPrediction ? { isValidForPrediction: 1 } : {}),
      },
    },
    { $group: { _id: `$${location}` } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, [location]: '$_id' } },
  ];
}

/**
   * @description runs mongodb aggregation using provided pipeline
   * @param {String} collectionName source collection
   * @param {Object[]} pipeline pipeline steps (see mongoDB docs)
   * @returns {Promise<Object[]>} output
   */
export function aggregate(collectionName, pipeline = []) {
  return new Promise((resolve, reject) => {
    const cursor = global.connection
      .collection(collectionName)
      .aggregate(pipeline);

    cursor.toArray((error, items) => {
      if (error) reject(error);
      resolve(items);
    });
  });
}
