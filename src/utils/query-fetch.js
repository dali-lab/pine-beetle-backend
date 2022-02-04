/**
 * @description recursively casts all possible string values to ints in object
 * @param {Object} obj object to parse
 * @returns {Object} object with same keys, and all possible values casted to ints
 */
function parseObjectValuesToInt(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    let parsedValue;

    if (typeof value === 'string') {
      try {
        parsedValue = parseInt(value, 10);
      } catch (error) {
        parsedValue = value;
      }
    } else if (typeof value === 'object') {
      parsedValue = parseObjectValuesToInt(value);
    }

    return { ...acc, [key]: parsedValue || value };
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
    const parsedQuery = parseObjectValuesToInt(query);

    const cursor = global.connection
      .collection(collectionName)
      .find(parsedQuery);

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
