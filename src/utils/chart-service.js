import { RESPONSE_CODES } from '../constants';
import { specifiedQueryFetch } from './query-fetch';

const getChartData = async (collectionName) => {
  try {
    const results = await specifiedQueryFetch(
      collectionName,
      {
        hasPredictionAndOutcome: 1,
      },
    );

    const data = results.map((record) => {
      return {
        year: record.year,
        state: record.state,
        county: record.county || undefined,
        rangerDistrict: record.rangerDistrict || undefined,
        probSpotsGT50: record.probSpotsGT50,
        lnSpots: record['ln(spotst0+1)'],
      };
    });

    return { ...RESPONSE_CODES.SUCCESS, data };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export default getChartData;
