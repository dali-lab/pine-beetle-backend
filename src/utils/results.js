import { specifiedQueryFetch } from './query-fetch';

const getResults = async (collectionName, filters = {}) => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const records = await specifiedQueryFetch(collectionName, {
    year: filters.year || lastYear,
    hasPredictionAndOutcome: 1,
    ...(filters.state ? { state: filters.state } : {}),
    ...(filters.county ? { county: filters.county } : {}),
    ...(filters.rangerDistrict ? { rangerDistrict: filters.rangerDistrict } : {}),
  });

  if (!records.length) {
    return [];
  }

  return records.map((record) => {
    return {
      state: record.state,
      county: record.county || undefined,
      rangerDistrict: record.rangerDistrict || undefined,
      probSpotsGT50: record.probSpotsGT50,
      sumSpots: record.spotst0,
    };
  });
};

export default getResults;
