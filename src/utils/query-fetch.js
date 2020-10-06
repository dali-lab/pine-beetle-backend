/**
 * @description queries database for items in collection based on provided query
 * @param {String} collectionName name of collection in db to query
 * @param {Object} [query] mongo query
 */
export const specifiedQueryFetch = (collectionName, query = {}) => {
  return new Promise((resolve, reject) => {
    // cast all possible strings to integers
    const parsedQuery = Object.entries(query).reduce((acc, [key, value]) => {
      let parsedValue;

      try {
        parsedValue = parseInt(value, 10);
      } catch (error) {
        console.log(error);
      }

      return {
        ...acc,
        [key]: parsedValue || value,
      };
    }, {});

    const cursor = global.connection
      .collection(collectionName)
      .find(parsedQuery);

    cursor.toArray((error, items) => {
      if (error) reject(error);
      resolve(items);
    });
  });
};

/**
 * @description queries database for items in collection based on filter
 * @param {String} collectionName name of collection in db to query
 * @param {Object} [queryParams] object of query parameters user specified
 * @param {Array<String>} [validQueryFields] array of acceptable query fields
 */
export const queryFetch = async (collectionName, queryParams = {}, validQueryFields = []) => {
  // generate query based on query params and valid fields
  const query = Object.entries(queryParams).reduce((acc, [key, value]) => {
    return {
      ...acc,
      ...value && validQueryFields.includes(key) ? { [key]: value } : {},
    };
  }, {});

  return specifiedQueryFetch(collectionName, query);
};
