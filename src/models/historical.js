import mongoose, { Schema } from 'mongoose';

// Historical Data = Combination of Summarized trapping Data + Spot Data
const HistoricalSchema = new Schema({
  objectIDs: [Number], // store array of objectIDs from ArcGIS to track which observations compose each row
  county: String,
  yearNumber: {
    type: Number,
    min: 0,
  },
  state: String,
  nf: String,
  classification: String,
  forest: String,
  rangerDistrictName: String,
  stateCode: {
    type: Number,
    min: 0,
  },
  forestCode: {
    type: Number,
    min: 0,
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
  },
  host: {
    type: Number,
    min: 0,
  },
  year: {
    type: Number,
    min: 1900,
    max: 2018,
  },
  spbPerTwoWeeks: {
    type: Number,
    min: 0,
  },
  cleridsPerTwoWeeks: {
    type: Number,
    min: 0,
  },
  spots: {
    type: Number,
    min: 0,
  },
  spotsPerHundredKm: {
    type: Number,
    min: 0,
  },
  percentSpb: {
    type: Number,
    min: 0,
    max: 100,
  },
  lure: String,
}, {
  toJSON: {
    virtuals: true,
  },
  strictQuery: true, // turn on strict mode for query filters
});

const HistoricalModel = mongoose.model('Historical', HistoricalSchema, 'historicals');
export default HistoricalModel;
