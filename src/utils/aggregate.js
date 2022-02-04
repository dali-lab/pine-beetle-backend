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
    $match: {
      ...(startYear && !endYear ? { year: { $gte: startYear } } : {}),
      ...(!startYear && endYear ? { year: { $lte: endYear } } : {}),
      ...(startYear && endYear ? { year: { $gte: startYear, $lte: endYear } } : {}),
      ...(state ? { state } : {}),
      ...(loc ? { [location]: loc } : {}),
    },
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
    createMatchStage(location, startYear, endYear, state, loc),
    {
      $group: {
        _id: '$year',
        spbPer2Weeks: { $sum: '$spbPer2Weeks' },
        cleridsPer2Weeks: { $sum: '$cleridsPer2Weeks' },
        spotst0: { $sum: '$spotst0' },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        year: '$_id',
        spbPer2Weeks: 1,
        cleridsPer2Weeks: 1,
        spotst0: 1,
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
    createMatchStage(location, startYear, endYear, state, loc),
    {
      $group: {
        _id: '$state',
        spbPer2Weeks: { $sum: '$spbPer2Weeks' },
        cleridsPer2Weeks: { $sum: '$cleridsPer2Weeks' },
        spotst0: { $sum: '$spotst0' },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        state: '$_id',
        spbPer2Weeks: 1,
        cleridsPer2Weeks: 1,
        spotst0: 1,
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
    createMatchStage(location, startYear, endYear, state, loc),
    {
      $group: {
        _id: `$${location}`,
        spbPer2Weeks: { $sum: '$spbPer2Weeks' },
        cleridsPer2Weeks: { $sum: '$cleridsPer2Weeks' },
        spotst0: { $sum: '$spotst0' },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        [location]: '$_id',
        spbPer2Weeks: 1,
        cleridsPer2Weeks: 1,
        spotst0: 1,
      },
    },
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
