import { COLLECTION_NAMES, RESPONSE_CODES } from '../constants';
import { queryFetch } from '../utils';
import { saveHistogramData, computeHistogramData } from '../utils/histogram-service';

/**
 * @description retrieves histogram data object
 * @returns {Promise<HistogramData>} promise that resolves to histogram data object or error
 */
export const getHistogramData = async () => {
  try {
    const histogramData = await queryFetch(COLLECTION_NAMES.histogram);
    return { ...RESPONSE_CODES.SUCCESS, data: histogramData[0] };
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
 * @description recalculates and saves histogram data object to the database
 * @returns {Promise<HistogramData>} promise that resolves to histogram data object or error
 */
export const updateHistogramData = async () => {
  try {
    const histogramData = await computeHistogramData();

    const savedHistogramData = await saveHistogramData(histogramData);
    return { ...RESPONSE_CODES.SUCCESS, data: savedHistogramData };
  } catch (error) {
    console.error(error);
    return error;
  }
};
