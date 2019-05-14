/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
// eslint-disable-next-line camelcase
import util from 'util';
import mongoose from 'mongoose';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';
import Process from '../importing-scripts/processRawData';
import SampleData from '../models/sample';
// import HistoricalSchema from '../models/historical';
import HistoricalModel from '../models/historical';
// import historical from './historical_controller';
mongoose.Promise = global.Promise;

const getSpotData = () => {
  return Spot_V2.find({});
};

const getBeetleData = () => {
  return Trapping.find({});
};

const getExistingSpots = (sampleid) => {
  return Spot_V2.findOne(
    { objectid: sampleid },
  );
};


const grabAvoid = async () => {
  return Spot_V2.find().distinct('objectid');
};

const formatToSpotCalc = (object, bodyFilters, objectid) => {
  const promises = [];

  /** ******************* */
  // Get filters
  // get current year for filtering too
  let currentYear = new Date().getFullYear(); // 2019
  currentYear = parseInt(currentYear, 10);
  const applicableState = bodyFilters.state;
  const applicableForest = bodyFilters.forest;
  // Convert to Title Case
  // Source: https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  // applicableForest = applicableForest.toLowerCase();
  // https://stackoverflow.com/questions/952924/javascript-chop-slice-trim-off-last-character-in-string
  // applicableForest = applicableForest.substring(0, applicableForest.length - 3);
  // applicableForest = applicableForest.charAt(0).toUpperCase() + applicableForest.slice(1);

  for (let i = 0; i < object.data.features.length; i++) {
    // console.log('for loop!');
    // console.log(object.data.features[i].attributes.objectid);

    if (
      (parseInt(object.data.features[i].attributes.Year, 10) === currentYear) // if entry matches current year
      && (object.data.features[i].attributes.USA_State === applicableState) // if entry matches specified state param
                  && (object.data.features[i].attributes.County === applicableForest) // if entry matches specified forest param
                  // && (objectid.includes(object.data.features[i].attributes.objectid) === false) // if not already in db
    ) {
      console.log(objectid);
      const newSpot = {};
      // console.log('got 1 spot');
      console.log(object.data.features[i].attributes.objectid);
      // console.log(object.data.features[i]);
      // console.log('made it through if statement');
      // DEBUGGING STATEMENTS
      // log each observation/data point from survey123
      // console.log(object.data.features[i]);
      // log the observation id of each data point from survey123URL
      // console.log(object.data.features[i].attributes.objectid);

      // Create Raw Spot
      newSpot.forest = object.data.features[i].attributes.forestName;
      newSpot.Nat_Forest_Ranger_Dist = object.data.features[i].attributes.Nat_Forest_Ranger_Dist;
      newSpot.is_Nat_Forest = object.data.features[i].attributes.is_Nat_Forest;

      newSpot.objectid = object.data.features[i].attributes.objectid;
      newSpot.latitude = object.data.features[i].geometry.y;
      newSpot.longitude = object.data.features[i].geometry.x;
      newSpot.SPB = object.data.features[i].attributes.SPB;
      newSpot.USA_State = object.data.features[i].attributes.USA_State;
      newSpot.County = object.data.features[i].attributes.County;
      newSpot.Year = parseInt(object.data.features[i].attributes.Year, 10);
      newSpot.TrapSetDate = object.data.features[i].attributes.TrapSetDate;
      newSpot.Trap_name = object.data.features[i].attributes.Trap_name;
      newSpot.Trap_Lure = object.data.features[i].attributes.Trap_Lure;
      newSpot.CollectionDate1 = object.data.features[i].attributes.CollectionDate1;
      newSpot.TrappingInterval1 = object.data.features[i].attributes.TrappingInterval1;
      newSpot.Number_SPB1 = object.data.features[i].attributes.Number_SPB1;
      newSpot.Number_Clerids1 = object.data.features[i].attributes.Number_Clerids1;
      newSpot.SPB_Plus_Clerids1 = object.data.features[i].attributes.SPB_Plus_Clerids1;
      newSpot.Percent_SPB1 = object.data.features[i].attributes.Percent_SPB1;
      newSpot.SPB_PerDay1 = object.data.features[i].attributes.SPB_PerDay1;
      newSpot.Clerids_PerDay1 = object.data.features[i].attributes.Clerids_PerDay1;
      newSpot.CollectionDate2 = object.data.features[i].attributes.CollectionDate2;
      newSpot.TrappingInterval2 = object.data.features[i].attributes.TrappingInterval2;
      newSpot.Number_SPB2 = object.data.features[i].attributes.Number_SPB2;
      newSpot.Number_Clerids2 = object.data.features[i].attributes.Number_Clerids2;
      newSpot.SPB_Plus_Clerids2 = object.data.features[i].attributes.SPB_Plus_Clerids2;
      newSpot.Percent_SPB2 = object.data.features[i].attributes.Percent_SPB2;
      newSpot.SPB_PerDay2 = object.data.features[i].attributes.SPB_PerDay2;
      newSpot.Clerids_PerDay2 = object.data.features[i].attributes.Clerids_PerDay2;
      newSpot.CollectionDate3 = object.data.features[i].attributes.CollectionDate3;
      newSpot.TrappingInterval3 = object.data.features[i].attributes.TrappingInterval3;
      newSpot.Number_SPB3 = object.data.features[i].attributes.Number_SPB3;
      newSpot.Number_Clerids3 = object.data.features[i].attributes.Number_Clerids3;
      newSpot.SPB_Plus_Clerids3 = object.data.features[i].attributes.SPB_Plus_Clerids3;
      newSpot.Percent_SPB3 = object.data.features[i].attributes.Percent_SPB3;
      newSpot.SPB_PerDay3 = object.data.features[i].attributes.SPB_PerDay3;
      newSpot.Clerids_PerDay3 = object.data.features[i].attributes.Clerids_PerDay3;
      newSpot.CollectionDate4 = object.data.features[i].attributes.CollectionDate4;
      newSpot.TrappingInterval4 = object.data.features[i].attributes.TrappingInterval4;
      newSpot.Number_SPB4 = object.data.features[i].attributes.Number_SPB4;
      newSpot.Number_Clerids4 = object.data.features[i].attributes.Number_Clerids4;
      newSpot.SPB_Plus_Clerids4 = object.data.features[i].attributes.SPB_Plus_Clerids4;
      newSpot.Percent_SPB4 = object.data.features[i].attributes.Percent_SPB4;
      newSpot.SPB_PerDay4 = object.data.features[i].attributes.SPB_PerDay4;
      newSpot.Clerids_PerDay4 = object.data.features[i].attributes.Clerids_PerDay4;
      newSpot.CollectionDate5 = object.data.features[i].attributes.CollectionDate5;
      newSpot.TrappingInterval5 = object.data.features[i].attributes.TrappingInterval5;
      newSpot.Number_SPB5 = object.data.features[i].attributes.Number_SPB5;
      newSpot.Number_Clerids5 = object.data.features[i].attributes.Number_Clerids5;
      newSpot.SPB_Plus_Clerids5 = object.data.features[i].attributes.SPB_Plus_Clerids5;
      newSpot.Percent_SPB5 = object.data.features[i].attributes.Percent_SPB5;
      newSpot.SPB_PerDay5 = object.data.features[i].attributes.SPB_PerDay5;
      newSpot.Clerids_PerDay5 = object.data.features[i].attributes.Clerids_PerDay5;
      newSpot.CollectionDate6 = object.data.features[i].attributes.CollectionDate6;
      newSpot.TrappingInterval6 = object.data.features[i].attributes.TrappingInterval6;
      newSpot.Number_SPB6 = object.data.features[i].attributes.Number_SPB6;
      newSpot.Number_Clerids6 = object.data.features[i].attributes.Number_Clerids6;
      newSpot.SPB_Plus_Clerids6 = object.data.features[i].attributes.SPB_Plus_Clerids6;
      newSpot.Percent_SPB6 = object.data.features[i].attributes.Percent_SPB6;
      newSpot.SPB_PerDay6 = object.data.features[i].attributes.SPB_PerDay6;
      newSpot.Clerids_PerDay6 = object.data.features[i].attributes.Clerids_PerDay6;
      newSpot.Sum_TrappingInterval = object.data.features[i].attributes.Sum_TrappingInterval;
      newSpot.Sum_SPB = object.data.features[i].attributes.Sum_SPB;
      newSpot.Sum_Clerids = object.data.features[i].attributes.Sum_Clerids;
      newSpot.Sum_SPB_Plus_Clerids = object.data.features[i].attributes.Sum_SPB_Plus_Clerids;
      newSpot.Overall_PercentSPB = object.data.features[i].attributes.Overall_PercentSPB;
      newSpot.Overall_SPB_PerDay = object.data.features[i].attributes.Overall_SPB_PerDay;
      newSpot.Overall_Clerids_PerDay = object.data.features[i].attributes.Overall_Clerids_PerDay;
      newSpot.Trapping_End_Date = object.data.features[i].attributes.Trapping_End_Date;

      // If DB running out of space, stop tracking these
      newSpot.Initial_Bloom = object.data.features[i].attributes.Initial_Bloom;
      newSpot.Species_Bloom = object.data.features[i].attributes.Species_Bloom;
      newSpot.Comments = object.data.features[i].attributes.Comments;
      newSpot.DeleteSurvey = object.data.features[i].attributes.DeleteSurvey;
      newSpot.Cooperator = object.data.features[i].attributes.Cooperator;
      newSpot.globalid = object.data.features[i].attributes.globalid;
      newSpot.Creator = object.data.features[i].attributes.Creator;
      newSpot.EditDate = object.data.features[i].attributes.EditDate;
      newSpot.Editor = object.data.features[i].attributes.Editor;
      newSpot.CreationDate = object.data.features[i].attributes.CreationDate;

      // Calculate num of trapping periods
      let periods = 0;
      if ((object.data.features[i].attributes.CollectionDate1 != null)) {
        periods += 1;
      }
      if ((object.data.features[i].attributes.CollectionDate2 != null)) {
        periods += 1;
      }
      if ((object.data.features[i].attributes.CollectionDate3 != null)) {
        periods += 1;
      }
      if ((object.data.features[i].attributes.CollectionDate4 != null)) {
        periods += 1;
      }
      if ((object.data.features[i].attributes.CollectionDate5 != null)) {
        periods += 1;
      }
      if ((object.data.features[i].attributes.CollectionDate6 != null)) {
        periods += 1;
      }
      newSpot.Num_Trapping_Periods = periods;

      promises.push(newSpot);
    }
    // console.log(object.data.features[i].attributes.objectid);
  }
  const promiseFR = Promise.resolve(promises);
  return promiseFR;
};

const formatToSpot = async (object, bodyFilters) => {
  // console.log(grabAvoid());
  return grabAvoid().then((avoidIds) => {
    console.log('entered .then() of grabAvoid() in formatToSpot()');
    // console.log('avoidIds');
    // console.log(avoidIds);
    return formatToSpotCalc(object, bodyFilters, avoidIds);
  }).catch((error) => {
    console.log('couldn\'t grab ids');
    console.log(error);
    return error;
  });
};

const uploadHistData = (histData) => {
  // View Processed Data
  // console.log(`histData = ${histData}`);
  // TODO
  // Insert Processed Data

  // for loop ok bc there should only be 1 entry at a time, but in array format
  // for (let i = 0; i < histData.length; i++) {
  //   // console.log(histData[i]);
  //   const hist = new HistoricalModel();
  //   hist.county = histData.county;
  //   hist.state = histData.state;
  //   hist.spbPerTwoWeeks = histData.spbPerTwoWeeks;
  //   hist.cleridsPerTwoWeeks = histData.cleridsPerTwoWeeks;
  //   hist.percentSpb = histData.percentSpb;
  //   hist.latitude = histData.latitude;
  //   hist.longitude = histData.longitude;
  //   hist.lure = histData.lure;
  //   hist.year = histData.year;
  //   hist.nf = histData.nf;
  //   hist.rangerDistrictName = histData.rangerDistrictName;
  //   hist.forest = histData.forest;
  //   hist.classification = histData.classification;
  // }

  // Works but unclear if/where it's saving
  // HistoricalModel.insertMany(
  //   histData,
  //   { ordered: false },
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   },
  // );
  // .then((response) => {
  //   // console.log(response);
  //   // Return to promise
  //   const promiseFR = Promise.resolve(response); // dataArrayFormatted;
  //   promiseFR.then((value) => {
  //     // console.log(value);
  //   });
  //   return promiseFR;
  // })
  // .error((err) => {
  //   // console.log(err);
  //   const promiseFR = Promise.resolve(err); // dataArrayFormatted;
  //   promiseFR.then((value) => {
  //     // console.log(value);
  //   });
  //   return promiseFR;
  // });


  // TypeError: histData[i].save is not a function
  // for (let i = 0; i < histData.length; i++) {
  //   const hist = new HistoricalModel();

  //   histData[i].save()
  //     .then((result) => {
  //       console.log(`uploaded...${result}`);
  //       console.log(`of raw...${histData[i]}`);
  //     });
  // }

  // for (let i = 0; i < spotData.length; i++) {
  //   const spot = new Spot_V2();
  //   spot.text = spot.text;
  //   p.imageURL = poll.imageURL;

  //   //  a promise
  //   p.save();
  // }

  // this is working but i don't know where it is saving
  // HistoricalModel.insert(histData, onInsert);
  // function onInsert(err, docs) {
  //   if (err) {
  //     // TODO: handle error
  //     // return err;
  //   } else {
  //     console.info('%d potatoes were successfully stored.', docs.length);
  //     // const promiseFR = Promise.resolve(spotData);
  //     // promiseFR.then((value) => {
  //     //   // console.log(value);
  //     // });
  //     // return promiseFR;
  //   }
  // }

  HistoricalModel.collection.insert(histData, onInsert);
  function onInsert(err, docs) {
    if (err) {
      // TODO: handle error
      // return err;
    } else {
      console.info('%d potatoes were successfully stored.', docs.length);
      // const promiseFR = Promise.resolve(spotData);
      // promiseFR.then((value) => {
      //   // console.log(value);
      // });
      // return promiseFR;
    }
  }

  // // Return to promise
  const promiseFR = Promise.resolve(histData); // dataArrayFormatted;
  promiseFR.then((value) => {
    // console.log(value);
  });
  return promiseFR;
};


const uploadRawData = (spotData) => {
  // View Raw Data
  console.log(`spotData= ${spotData}`);

  // Insert Raw Data

  // OPT 1
  // Spot_V2.insertMany(spotData, { ordered: false }, (err, docs) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     // console.log(docs)
  //   }
  // });

  // OPT 2
  // for (let i = 0; i < spotData.length; i++) {
  //   const spot = new Spot_V2();
  //   spot.text = spot.text;
  //   p.imageURL = poll.imageURL;

  //   //  a promise
  //   p.save();
  // }
  // for (let i = 0; i < spotData.length; i++) {
  //   spotData[i].save();
  //   // .then((result) => {
  //   //   console.log(`uploaded...${result}`);
  //   //   console.log(`of raw...${spotData[i]}`);
  //   // });
  // }


  // OPT3 https://stackoverflow.com/questions/16726330/mongoose-mongodb-batch-insert
  // let Potato = mongoose.model('Potato', PotatoSchema);
  // let potatoBag = [/* a humongous amount of potato objects */];
  // Potato.collection.insert(potatoBag, onInsert);
  // function onInsert(err, docs) {
  //   if (err) {
  //     // TODO: handle error
  //   } else {
  //     console.info('%d potatoes were successfully stored.', docs.length);
  //   }
  // }


  // const Spot_V2 = mongoose.model('Spot', Spot_V2_Schema);
  // const spotBag = [/* a humongous amount of spot objects */]; //spotData
  Spot_V2.collection.insert(spotData, onInsert);
  function onInsert(err, docs) {
    if (err) {
      // TODO: handle error
      // return err;
    } else {
      console.info('%d potatoes were successfully stored.', docs.length);
      // const promiseFR = Promise.resolve(spotData);
      // promiseFR.then((value) => {
      //   // console.log(value);
      // });
      // return promiseFR;
    }
  }

  const promiseFR = Promise.resolve(spotData);
  promiseFR.then((value) => {
    // console.log(value);
  });
  return promiseFR;
};

const editField = (sampleId, field, newValue) => {
  SampleData.findOne({ _id: sampleId }).then((example) => {
    example.field = newValue;
    return example.save();
  });
};


const controller = {
  getSpotData, getBeetleData, editField, formatToSpot, formatToSpotCalc, uploadRawData, uploadHistData,
};
export default controller;
