/**
 * @description recursively casts all possible string values to ints in object and null strings to null
 * @param {Object} obj object to parse
 * @returns {Object} object with same keys, and all possible values casted to ints or nulls
 */
function parseObjectValuesToIntOrNull(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    let parsedValue;

    if (value === 'null') {
      parsedValue = null;
    } else if (typeof value === 'string') {
      parsedValue = parseInt(value, 10);
    } else if (typeof value === 'object') {
      parsedValue = parseObjectValuesToIntOrNull(value);
    }

    return {
      ...acc,
      [key]: parsedValue === undefined || Number.isNaN(parsedValue)
        ? value
        : parsedValue,
    };
  }, {});
}

/**
 * @description queries database for items in collection based on provided query -- uses mongo syntax
 * @param {String} collectionName name of collection in db to query
 * @param {Object} [query] mongo query
 * @returns {Promise<Object[]>} result from database
 */
export function specifiedQueryFetch(collectionName, query = {}) {
  return new Promise((resolve, reject) => {
    // cast all possible strings to integers
    const parsedQuery = parseObjectValuesToIntOrNull(query);

    const { county, rangerDistrict } = parsedQuery;

    const fixedParsedQuery = {
      ...parsedQuery,
      ...(county ? { county: { $in: county.split(',') } } : {}),
      ...(rangerDistrict ? { rangerDistrict: { $in: rangerDistrict.split(',') } } : {}),
    };

    const cursor = global.connection
      .collection(collectionName)
      .find(fixedParsedQuery);

    cursor.toArray((error, items) => {
      if (error) reject(error);
      resolve(items);
    });
  });
}

/**
 * @description queries database for items in collection based on filter
 * @param {String} collectionName name of collection in db to query
 * @param {Object} [queryParams] object of query parameters user specified
 * @param {Array<String>} [validQueryFields] array of acceptable query fields
 * @returns {Promise<Object[]>} result from database
 */
export async function queryFetch(collectionName, queryParams = {}, validQueryFields = []) {
  // filter out unspecified fields in query
  const query = Object.entries(queryParams).reduce((acc, [key, value]) => {
    return {
      ...acc,
      ...(validQueryFields.includes(key) ? { [key]: value } : {}),
    };
  }, {});

  return specifiedQueryFetch(collectionName, query);
}
