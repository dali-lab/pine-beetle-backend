import RESPONSE_CODES from './response-codes.json';
import RESPONSE_TYPES from './response-types.json';

// names of collections in MongoDB Atlas
const COLLECTION_NAMES = {
  predictionsCounty: 'countypredictions',
  predictionsRangerDistrict: 'rdpredictions',
  spotsCounty: 'spotdatacounties',
  spotsRangerDistrict: 'spotdatarangerdistricts',
  summarizedCounty: 'summarizedcountytrappings',
  summarizedRangerDistrict: 'summarizedrangerdistricttrappings',
  unsummarized: 'unsummarizedtrappings',
  users: 'users',
};

/**
 * @description given authorization header, return username and password
 * @param {String} authorization authorization header
 * @returns {Object} with fields for email and password
 */
export const extractCredentialsFromAuthorization = (authorization) => {
  // adapted from: https://gist.github.com/charlesdaniel/1686663
  const auth = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');

  return {
    email: auth[0],
    password: auth[1],
  };
};

/**
 * @param {String} responseType type of response to send
 * @param {Object} payload data or error info to send
 * @returns {Object} standardized object to send to client
 */
export const generateResponse = (responseType, payload) => {
  const responseInfo = RESPONSE_CODES[responseType];

  const { status, type } = responseInfo;

  return {
    status,
    type,
    ...(status === RESPONSE_CODES.SUCCESS.status ? { data: payload } : { error: payload }),
  };
};

export {
  COLLECTION_NAMES,
  RESPONSE_CODES,
  RESPONSE_TYPES,
};
