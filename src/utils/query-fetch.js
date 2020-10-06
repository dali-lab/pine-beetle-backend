/**
 * @description queries database for items in collection based on filter
 * @param {String} collectionName name of collection in db to query
 * @param {Object} queryParams object of query parameters user specified
 * @param {Array<String>} validQueryFields array of acceptable query fields
 */
export default (collectionName, queryParams, validQueryFields) => {
  return new Promise((resolve, reject) => {
    // generate query based on query params and valid fields
    const query = Object.entries(queryParams).reduce((acc, [key, value]) => {
      let parsedValue;

      try {
        parsedValue = parseInt(value, 10);
      } catch (error) {
        console.log(error);
      }

      return {
        ...acc,
        ...value && validQueryFields.includes(key) ? { [key]: parsedValue || value } : {},
      };
    }, {});

    const cursor = global.connection
      .collection(collectionName)
      .find(query);

    cursor.toArray((error, items) => {
      if (error) reject(error);
      resolve(items);
    });
  });
};
