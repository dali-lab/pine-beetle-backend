/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
import util from 'util';
import mongoose from 'mongoose';
import trappingData from '../models/trappingData';

mongoose.Promise = global.Promise;

const getSpotData = () => {
  return trappingData.find({});
};

const getExistingSpots = (sampleid) => {
  return trappingData.findOne(
    { objectid: sampleid },
  );
};


const grabAvoid = async () => {
  return trappingData.find().distinct('objectid');
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
      console.log(object.data.features[i].attributes.objectid);

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
  }
  const promiseFR = Promise.resolve(promises);
  return promiseFR;
};

const formatToSpot = async (object, bodyFilters) => {
  return grabAvoid().then((avoidIds) => {
    return formatToSpotCalc(object, bodyFilters, avoidIds);
  }).catch((error) => {
    console.log('couldn\'t grab ids');
    console.log(error);
    return error;
  });
};

const uploadTrappingData = (trappingData) => {
  trappingData.collection.insert(trappingData, onInsert);
  function onInsert(err, docs) {
    if (err) {
    } else {
      console.info('%d trapping Data successfully stored.', docs.length);
    }
  }

  const promiseFR = Promise.resolve(spotData);
  promiseFR.then((value) => {
  });
  return promiseFR;
};

const controller = {
  getSpotData, getExistingSpots, grabAvoid, formatToSpot, formatToSpotCalc, uploadTrappingData,
};
export default controller;