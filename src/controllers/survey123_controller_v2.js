/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
 import Spot_V2 from '../models/spot_v2';
 import Trapping from '../models/trapping';
 import processRawData from '../importing-scripts';

const getSpotData = () => {
 	return Spot.find({})
 };

const getBeetleData = () => {
 	return Trapping.find({})
 };

//might need to make async
const uploadSpotData = (object) => {
  console.log("uploadSpotData running");
  // console.log(object);
  // console.log(object.status);
  // console.log(object.data);
  // console.log(typeof object);

  //Multi Obj Version
  let dataArray = [];

  for (var i = 0; i < object.data.features.length; i++) {
    //log each observation/data point from survey123
    // console.log(object.data.features[i]);

    //log the observation id of each data point from survey123URL
    // console.log(object.data.features[i].attributes.objectid);

    const newSpot = {};

    newSpot.objectid = object.data.features[i].attributes.objectid;
    newSpot.globalid = object.data.features[i].attributes.globalid;
    newSpot.latitude = object.data.features[i].geometry.y;
    newSpot.longitude = object.data.features[i].geometry.x;
    newSpot.SPB = object.data.features[i].attributes.SPB;
    newSpot.USA_State = object.data.features[i].attributes.USA_State;
    newSpot.County = object.data.features[i].attributes.County;
    newSpot.Year = object.data.features[i].attributes.Year;
    newSpot.TrapSetDate = object.data.features[i].attributes.TrapSetDate;
    newSpot.Trap_name = object.data.features[i].attributes.Trap_name;
    newSpot.Cooperator = object.data.features[i].attributes.Cooperator;
    newSpot.Trap_Lure = object.data.features[i].attributes.Trap_Lure;
    newSpot.Initial_Bloom = object.data.features[i].attributes.Initial_Bloom;
    newSpot.Species_Bloom = object.data.features[i].attributes.Species_Bloom;
    newSpot.Comments = object.data.features[i].attributes.Comments;
    newSpot.DeleteSurvey = object.data.features[i].attributes.DeleteSurvey;
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
    newSpot.CreationDate = object.data.features[i].attributes.CreationDate;
    newSpot.Creator = object.data.features[i].attributes.Creator;
    newSpot.EditDate = object.data.features[i].attributes.EditDate;
    newSpot.Editor = object.data.features[i].attributes.Editor;
    newSpot.Trapping_End_Date = object.data.features[i].attributes.Trapping_End_Date;
    newSpot.Num_Weeks_Trapping = object.data.features[i].attributes.Num_Weeks_Trapping;

    dataArray.push(newSpot);

  }

  // Spot.insertMany(
  //   dataArray,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   }
  // );

  // //Single Obj Version
	// const newSpot = new Spot_V2();
  //
  // //Might need to rearrange based on json output (ex. object.attributes[]. etc.)
  // newSpot.objectid = object[objectid]
  // newSpot.globalid = object[globalid]
  // newSpot.SPB = object[SPB]
  // newSpot.USA_State = object[USA_State]
  // newSpot.County = object[County]
  // newSpot.Year = object[Year]
  // newSpot.TrapSetDate = object[TrapSetDate]
  // newSpot.Trap_name = object[Trap_name]
  // newSpot.Cooperator = object[Cooperator]
  // newSpot.Trap_Lure = object[Trap_Lure]
  // newSpot.Initial_Bloom = object[Initial_Bloom]
  // newSpot.Species_Bloom = object[Species_Bloom]
  // newSpot.Comments = object[Comments]
  // newSpot.DeleteSurvey = object[DeleteSurvey]
  // newSpot.CollectionDate1 = object[CollectionDate1]
  // newSpot.TrappingInterval1 = object[TrappingInterval1]
  // newSpot.Number_SPB1 = object[Number_SPB1]
  // newSpot.Number_Clerids1 = object[Number_Clerids1]
  // newSpot.SPB_Plus_Clerids1 = object[SPB_Plus_Clerids1]
  // newSpot.Percent_SPB1 = object[Percent_SPB1]
  // newSpot.SPB_PerDay1 = object[SPB_PerDay1]
  // newSpot.Clerids_PerDay1 = object[Clerids_PerDay1]
  // newSpot.CollectionDate2 = object[CollectionDate2]
  // newSpot.TrappingInterval2 = object[TrappingInterval2]
  // newSpot.Number_SPB2 = object[Number_SPB2]
  // newSpot.Number_Clerids2 = object[SPB]
  // newSpot.SPB_Plus_Clerids2 = object[SPB]
  // newSpot.Percent_SPB2 = object[SPB]
  // newSpot.SPB_PerDay2 = object[SPB]
  // newSpot.Clerids_PerDay2 = object[SPB]
  // newSpot.CollectionDate3 = object[SPB]
  // newSpot.TrappingInterval3 = object[SPB]
  // newSpot.Number_SPB3 = object[SPB]
  // newSpot.Number_Clerids3 = object[SPB]
  // newSpot.SPB_Plus_Clerids3 = object[SPB]
  // newSpot.Percent_SPB3 = object[SPB]
  // newSpot.SPB_PerDay3 = object[SPB]
  // newSpot.Clerids_PerDay3 = object[Clerids_PerDay3]
  // newSpot.CollectionDate4 = object[CollectionDate4]
  // newSpot.TrappingInterval4 = object[TrappingInterval4]
  // newSpot.Number_SPB4 = object[Number_SPB4]
  // newSpot.Number_Clerids4 = object[Number_Clerids4]
  // newSpot.SPB_Plus_Clerids4 = object[SPB_Plus_Clerids4]
  // newSpot.Percent_SPB4 = object[Percent_SPB4]
  // newSpot.SPB_PerDay4 = object[SPB_PerDay4]
  // newSpot.Clerids_PerDay4 = object[Clerids_PerDay4]
  // newSpot.CollectionDate5 = object[CollectionDate5]
  // newSpot.TrappingInterval5 = object[TrappingInterval5]
  // newSpot.Number_SPB5 = object[Number_SPB5]
  // newSpot.Number_Clerids5 = object[Number_Clerids5]
  // newSpot.SPB_Plus_Clerids5 = object[SPB_Plus_Clerids5]
  // newSpot.Percent_SPB5 = object[Percent_SPB5]
  // newSpot.SPB_PerDay5 = object[SPB_PerDay5]
  // newSpot.Clerids_PerDay5 = object[Clerids_PerDay5]
  // newSpot.CollectionDate6 = object[CollectionDate6]
  // newSpot.TrappingInterval6 = object[TrappingInterval6]
  // newSpot.Number_SPB6 = object[Number_SPB6]
  // newSpot.Number_Clerids6 = object[Number_Clerids6]
  // newSpot.SPB_Plus_Clerids6 = object[SPB_Plus_Clerids6]
  // newSpot.Percent_SPB6 = object[Percent_SPB6]
  // newSpot.SPB_PerDay6 = object[SPB_PerDay6]
  // newSpot.Clerids_PerDay6 = object[Clerids_PerDay6]
  // newSpot.Sum_TrappingInterval = object[Sum_TrappingInterval]
  // newSpot.Sum_SPB = object[Sum_SPB]
  // newSpot.Sum_Clerids = object[Sum_Clerids]
  // newSpot.Sum_SPB_Plus_Clerids = object[Sum_SPB_Plus_Clerids]
  // newSpot.Overall_PercentSPB = object[Overall_PercentSPB]
  // newSpot.Overall_SPB_PerDay = object[Overall_SPB_PerDay]
  // newSpot.Overall_Clerids_PerDay = object[Overall_Clerids_PerDay]
  // newSpot.CreationDate = object[CreationDate]
  // newSpot.Creator = object[Creator]
  // newSpot.EditDate = object[EditDate]
  // newSpot.Editor = object[Editor]
  // newSpot.Trapping_End_Date = object[Trapping_End_Date]
  // newSpot.Num_Weeks_Trapping = object[Num_Weeks_Trapping]
  //
  // console.log(newSpot);
  //
  // return newSpot.save()
  //   .catch((err) => {
  //     console.log(err);
  //   });

  //return for testing only
  var promise1 = Promise.resolve(dataArray);
  promise1.then(function(value) {
    console.log(value);
    // expected output: 123
  });
  return promise1;

};


const editField = (sampleId, field, newValue) => {
	SampleData.findOne({ _id: sampleId }).then((example) => {
		example.field = newValue;
		return example.save();
	});
};


const controller = { uploadSpotData };
export default controller;
