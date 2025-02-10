import { Router } from 'express';
import {
  generateResponse,
  RESPONSE_TYPES,
  RESPONSE_CODES,
} from '../constants';
import { Histogram } from '../controllers';
import { updateHistogramData } from '../controllers/histogram';
import { requireAuth } from '../middleware';

const histogramRouter = Router();

// returns histogram data
histogramRouter.route('/').get(async (_req, res) => {
  try {
    const data = await Histogram.getHistogramData();

    res.send(generateResponse(RESPONSE_TYPES.SUCCESS, data.data));
  } catch (error) {
    res
      .status(RESPONSE_CODES.INTERNAL_ERROR.status)
      .send(generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error));
  }
});

// calculates histogram data
histogramRouter.route('/update').post([requireAuth], async (req, res) => {
  try {
    const data = await updateHistogramData();

    res.send(generateResponse(RESPONSE_TYPES.SUCCESS, data));
  } catch (error) {
    res
      .status(RESPONSE_CODES.INTERNAL_ERROR.status)
      .send(generateResponse(RESPONSE_TYPES.INTERNAL_ERROR, error));
  }
});

export default histogramRouter;
