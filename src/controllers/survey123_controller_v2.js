/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
 import Spot_V2 from '../models/spot_v2';
 import Trapping from '../models/trapping';
 import Process from '../importing-scripts/processRawData';

const getSpotData = () => {
 	return Spot_V2.find({})
 };

const getBeetleData = () => {
 	return Trapping.find({})
 };

//might need to make async
const uploadSpotData = (object, bodyFilters) => {
  // console.log(object.data.features);

  //Get filters
  var applicableState = bodyFilters.state;
  var applicableForest = bodyFilters.forest;

  // get current year for filtering too
  var currentYear = 2019;//new Date().getFullYear();
  // currentYear = parseInt(currentYear)

  //Multi Obj Version
  let dataArray = [];

  console.log("data length = " + object.data.features.length);

  // console.log("currentYear = " + currentYear + ", Year = " + object.data.features[0].attributes.Year)

  for (var i = 0; i < object.data.features.length; i++) {
    // console.log(object.data.features[i]);
    //Filter which data to consider
    if ((parseInt(object.data.features[i].attributes.Year) === currentYear) && (object.data.features[i].attributes.USA_State === applicableState)) {
      // && (object.data.features[i].attributes.Trapping_End_Date != null)

      console.log("made it inside if statement!!!!!");

      //DEBUGGING STATEMENTS
      //log each observation/data point from survey123
      // console.log(object.data.features[i]);
      //log the observation id of each data point from survey123URL
      // console.log(object.data.features[i].attributes.objectid);
      console.log("test1 " + object.data.features[i].attributes.forestName)

      const newSpot = {};

      //expected to be implemented by USFS, will not work if not
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

      //Calculate num of trapping periods
      var periods = 0;
      if ((object.data.features[i].attributes.CollectionDate1 != null)) {
        periods++;
      };
      if ((object.data.features[i].attributes.CollectionDate2 != null)) {
         periods++;
      };
      if ((object.data.features[i].attributes.CollectionDate3 != null)) {
        periods++;
      };
      if ((object.data.features[i].attributes.CollectionDate4 != null)) {
        periods++;
      };
      if ((object.data.features[i].attributes.CollectionDate5 != null)) {
        periods++;
      };
      if ((object.data.features[i].attributes.CollectionDate6 != null)) {
        periods++;
      };
      newSpot.Num_Trapping_Periods = periods;

      console.log(newSpot.USA_State);

      dataArray.push(newSpot);
    }
  }

  //Process to Historical Form
  var dataArrayFormatted = [];
  dataArrayFormatted = Process.formatToSpot(dataArray);

  //View Processed Data
  // console.log("dataArrayFormatted = " + dataArrayFormatted);

  //Insert to DB
  // Spot_V2.insertMany(
  //   dataArrayFormatted,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   }
  // );


  //Return to frontend
  var promiseFR = Promise.resolve(dataArrayFormatted);
  promiseFR.then(function(value) {
    // console.log(value);
    // expected output: 123
  });
  return promiseFR;

};


const editField = (sampleId, field, newValue) => {
	SampleData.findOne({ _id: sampleId }).then((example) => {
		example.field = newValue;
		return example.save();
	});
};


const controller = { uploadSpotData };
export default controller;
