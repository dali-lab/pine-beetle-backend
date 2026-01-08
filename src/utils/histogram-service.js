import { COLLECTION_NAMES, RESPONSE_CODES } from '../constants';
import { specifiedQueryFetch } from './query-fetch';

// x axis of the histogram - predicted probability of an outbreak
export const probRanges = [
  { min: 0, max: 0.025 },
  { min: 0.025, max: 0.05 },
  { min: 0.05, max: 0.15 },
  { min: 0.15, max: 0.25 },
  { min: 0.25, max: 0.4 },
  { min: 0.4, max: 0.6 },
  { min: 0.6, max: 0.8 },
  { min: 0.8, max: 1 },
];

// y axis of the histogram - actual number of spots observed
const spotsRanges = [
  { min: 0, max: 0 },
  { min: 1, max: 9 },
  { min: 10, max: 19 },
  { min: 20, max: 49 },
  { min: 50, max: 99 },
  { min: 100, max: 249 },
  { min: 250, max: Infinity },
];

const categorizeRecords = (records) => {
  const frequencyArray = probRanges.map(({ min, max }) => {
    const rangeLabel = `${min === 0 ? '0' : min}-${max}`;
    const rangeRecords = records.filter((record) => {
      return record.probSpotsGT50 > min && record.probSpotsGT50 <= max;
    });

    // eslint-disable-next-line no-shadow
    const data = spotsRanges.map(({ min, max }) => {
      return rangeRecords.filter((record) => {
        return record.spotst0 >= min && record.spotst0 <= max;
      }).length;
    });

    return {
      range: rangeLabel,
      frequency: rangeRecords.length,
      withBorder: false,
      data,
    };
  });

  return frequencyArray;
};
function validateRecords(records) {
  return records.filter((record) => {
    return (
      record.probSpotsGT50 !== null
            && record.probSpotsGT50 !== undefined
            && record.spotst0 !== null
            && record.spotst0 !== undefined
    );
  });
}

export const computeHistogramData = async () => {
  try {
    const counties = await specifiedQueryFetch(
      COLLECTION_NAMES.summarizedCounty,
      {
        hasPredictionAndOutcome: 1,
      },
    );

    const rangerDistricts = await specifiedQueryFetch(
      COLLECTION_NAMES.summarizedRangerDistrict,
      {
        hasPredictionAndOutcome: 1,
      },
    );

    const data = [...counties, ...rangerDistricts];
    const validRecords = validateRecords(data);
    const frequency = validRecords.length;
    const frequencyArray = categorizeRecords(validRecords);

    return { ...RESPONSE_CODES.SUCCESS, frequency, frequencyArray };
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const saveHistogramData = async (histogramData) => {
  if (!global.connection) {
    throw new Error('Database connection not established');
  }

  const cursor = global.connection.collection('histogram');

  const { frequency, frequencyArray } = histogramData;

  const savedData = await cursor.updateOne(
    { _id: 'chartData' },
    {
      $set: {
        timestamp: new Date(),
        frequencyArray,
        frequency,
      },
    },
    { upsert: true },
  );

  return savedData;
};
