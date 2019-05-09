import mongoose, { Schema } from 'mongoose';

// TODO historical data is NOT the same format as Survey123 data (which is already either Trapping or Spot)
// when fetching data to display, it could be returned in up to 3 different models
// it may be easiest to choose to use only historical data up to some year, say 2018 (where it ends)
// and then use Survey123 data from that point on (2019+)
const HistoricalSchema = new Schema({
  objectIDs: [Number], // store array of objectIDs from ArcGIS to track which observations compose each row
  county: String,
  // numTraps: Number, //for data processing only
  // trapsSeen: Number, //for data processing only
  yearNumber: {
    type: Number,
    min: 0,
  },
  state: String,
  nf: String,
  classification: String,
  forest: String,
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
    max: 2016,
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

const HistoricalModel = mongoose.model('Historical', HistoricalSchema);
export default HistoricalModel;
