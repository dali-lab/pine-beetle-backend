/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
// eslint-disable-next-line camelcase
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';
import Process from '../importing-scripts/processRawData';
import SampleData from '../models/sample';
import HistoricalSchema from '../models/historical';
// import historical from './historical_controller';

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

const uploadSpotData = (object, bodyFilters) => {
  /* Setup */
  // Multi Obj Version
  const dataArray = [];
  // Create forest map
  const stateAbbrevToStateName = {
    AL: 'Alabama',
    AR: 'Arkansas',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    KY: 'Kentucky',
    LA: 'Louisiana',
    MD: 'Maryland',
    MS: 'Mississippi',
    NC: 'North Carolina',
    NJ: 'New Jersey',
    OK: 'Oklahoma',
    SC: 'South Carolina',
    TN: 'Tennesse',
    TX: 'Texas',
    VA: 'Virginia',
  };
  // Get filters
  // get current year for filtering too
  let currentYear = new Date().getFullYear(); // 2019
  currentYear = parseInt(currentYear, 10);
  const applicableState = bodyFilters.state;
  let applicableForest = bodyFilters.forest;
  // Convert to Title Case
  // Source: https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  applicableForest = applicableForest.toLowerCase();
  // https://stackoverflow.com/questions/952924/javascript-chop-slice-trim-off-last-character-in-string
  applicableForest = applicableForest.substring(0, applicableForest.length - 3);
  applicableForest = applicableForest.charAt(0).toUpperCase() + applicableForest.slice(1);

  /* Iterate through raw data, process into spot:
  *  If data matches filters and object ID is NOT in the database, then format into spot and add.
  */
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < object.data.features.length; i++) {
    // eslint-disable-next-line no-loop-func
    getExistingSpots(object.data.features[i].attributes.objectid).then((myData) => {
      if (myData === null) { // if db does not already contain entry
        if (
          (parseInt(object.data.features[i].attributes.Year, 10) === currentYear) // if entry matches current year
          && (object.data.features[i].attributes.USA_State === applicableState) // if entry matches specified state param
          && (object.data.features[i].attributes.County === applicableForest) // if entry matches specified forest param
        ) {
          // DEBUGGING STATEMENTS
          // log each observation/data point from survey123
          // console.log(object.data.features[i]);
          // log the observation id of each data point from survey123URL
          // console.log(object.data.features[i].attributes.objectid);

          // Create Raw Spot
          const newSpot = {};

          newSpot.forest = object.data.features[i].attributes.forestName;
          newSpot.rangerDistrictName = object.data.features[i].attributes.Nat_Forest_Ranger_Dist;
          newSpot.isNF = object.data.features[i].attributes.isNF;

          newSpot.objectid = object.data.features[i].attributes.objectid;
          newSpot.latitude = object.data.features[i].geometry.y;
          newSpot.longitude = object.data.features[i].geometry.x;
          newSpot.SPB = object.data.features[i].attributes.SPB;
          newSpot.USA_State = object.data.features[i].attributes.USA_State;
          newSpot.County = object.data.features[i].attributes.County;
          newSpot.Year = object.data.features[i].attributes.Year;
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

          dataArray.push(newSpot);
        }
      }
    });
  }

  /* Add Spot Data to DB */
  // View Raw Data
  // console.log(`dataArray raw = ${dataArray}`);
  // TODO
  // Insert Raw Data
  // Spot_V2.insertMany(
  //   dataArray,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   }
  // );


  /* Process to Historical Form */
  let dataArrayFormatted = [];
  dataArrayFormatted = Process.formatToSpot(dataArray);

  // View Processed Data
  console.log(`dataArrayFormatted = ${dataArrayFormatted}`);
  // TODO
  // Insert Processed Data
  // HistoricalSchema.insertMany(
  //   dataArrayFormatted,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   }
  // );


  // Return to frontend
  const promiseFR = Promise.resolve(dataArrayFormatted);
  promiseFR.then((value) => {
  // console.log(value);
  });
  return promiseFR;
};


// might need to make async
const OLDuploadSpotData = (object, bodyFilters) => {
  // console.log(object.data.features);

  // Create forest map
  const stateAbbrevToStateName = {
    AL: 'Alabama',
    AR: 'Arkansas',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    KY: 'Kentucky',
    LA: 'Louisiana',
    MD: 'Maryland',
    MS: 'Mississippi',
    NC: 'North Carolina',
    NJ: 'New Jersey',
    OK: 'Oklahoma',
    SC: 'South Carolina',
    TN: 'Tennesse',
    TX: 'Texas',
    VA: 'Virginia',
  };

  // Get filters
  const applicableState = bodyFilters.state;
  let applicableForest = bodyFilters.forest;

  // Convert to Title Case
  // Source: https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  applicableForest = applicableForest.toLowerCase();

  // https://stackoverflow.com/questions/952924/javascript-chop-slice-trim-off-last-character-in-string
  applicableForest = applicableForest.substring(0, applicableForest.length - 3);

  applicableForest = applicableForest.charAt(0).toUpperCase() + applicableForest.slice(1);


  // get current year for filtering too
  let currentYear = new Date().getFullYear(); // 2019
  currentYear = parseInt(currentYear, 10);

  // Multi Obj Version
  const dataArray = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < object.data.features.length; i++) {
    // Filter which data to consider:
    // if (correct year) && (correct state) && (correct foresrt)
    if ((parseInt(object.data.features[i].attributes.Year, 10) === currentYear) && (object.data.features[i].attributes.USA_State === applicableState) && (object.data.features[i].attributes.County === applicableForest)) {
      // && (object.data.features[i].attributes.Trapping_End_Date != null)
      // console.log("made it inside if statement!!!!!");


      // DEBUGGING STATEMENTS
      // log each observation/data point from survey123
      // console.log(object.data.features[i]);
      // log the observation id of each data point from survey123URL
      // console.log(object.data.features[i].attributes.objectid);

      const newSpot = {};
      // expected to be implemented by USFS, will not work if not
      newSpot.forest = object.data.features[i].attributes.forestName;
      newSpot.rangerDistrictName = object.data.features[i].attributes.Nat_Forest_Ranger_Dist;
      newSpot.isNF = object.data.features[i].attributes.isNF;

      newSpot.objectid = object.data.features[i].attributes.objectid;
      newSpot.latitude = object.data.features[i].geometry.y;
      newSpot.longitude = object.data.features[i].geometry.x;
      newSpot.SPB = object.data.features[i].attributes.SPB;
      newSpot.USA_State = object.data.features[i].attributes.USA_State;
      newSpot.County = object.data.features[i].attributes.County;
      newSpot.Year = object.data.features[i].attributes.Year;
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

      // Currently not tracking, but easy to add tracking for...
      // newSpot.Initial_Bloom = object.data.features[i].attributes.Initial_Bloom;
      // newSpot.Species_Bloom = object.data.features[i].attributes.Species_Bloom;
      // newSpot.Comments = object.data.features[i].attributes.Comments;
      // newSpot.DeleteSurvey = object.data.features[i].attributes.DeleteSurvey;
      // newSpot.Cooperator = object.data.features[i].attributes.Cooperator;
      // newSpot.globalid = object.data.features[i].attributes.globalid;
      // newSpot.Creator = object.data.features[i].attributes.Creator;
      // newSpot.EditDate = object.data.features[i].attributes.EditDate;
      // newSpot.Editor = object.data.features[i].attributes.Editor;
      // newSpot.CreationDate = object.data.features[i].attributes.CreationDate;

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

      // console.log(newSpot);

      dataArray.push(newSpot);
    }
  }

  // Process to Historical Form
  let dataArrayFormatted = [];
  dataArrayFormatted = Process.formatToSpot(dataArray);

  // View Raw Data
  console.log(`dataArray raw = ${dataArray}`);
  // TODO
  // Insert Raw Data
  // db.raw.insertMany(
  //   dataArray,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   }
  // );

  // View Processed Data
  console.log(`dataArrayFormatted = ${dataArrayFormatted}`);
  // TODO
  // Insert Processed Data
  // db.historicals.insertMany(
  //   dataArrayFormatted,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   }
  // );


  // Return to frontend
  const promiseFR = Promise.resolve(dataArrayFormatted);
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
  getSpotData, getBeetleData, uploadSpotData, editField,
};
export default controller;
