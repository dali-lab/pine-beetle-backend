/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
 import Spot_V2 from '../models/spot_v2';
 import Trapping from '../models/trapping';

 export const getSpotData = () => {
 	return Spot.find({})
 };

export const getBeetleData = () => {
 	return Trapping.find({})
 };

//might need to make async
export const uploadSpotData = () => {
  console.log("uploadSpotData running");

  //return for testing only
  var promise1 = Promise.resolve(123);
  promise1.then(function(value) {
    console.log(value);
    // expected output: 123
  });
  return promise1;

	// console.log(object);

  // //Multi Obj Version
  // let dataArray = [];
  // object.forEach((rawObject) => {
  //   const newSpot = {};
  //
  //   newSpot.objectid = rawObject[objectid]
  //   newSpot.globalid = rawObject[globalid]
  //   newSpot.SPB = rawObject[SPB]
  //   newSpot.USA_State = rawObject[USA_State]
  //   newSpot.County = rawObject[County]
  //   newSpot.Year = rawObject[Year]
  //   newSpot.TrapSetDate = rawObject[TrapSetDate]
  //   newSpot.Trap_name = rawObject[Trap_name]
  //   newSpot.Cooperator = rawObject[Cooperator]
  //   newSpot.Trap_Lure = rawObject[Trap_Lure]
  //   newSpot.Initial_Bloom = rawObject[Initial_Bloom]
  //   newSpot.Species_Bloom = rawObject[Species_Bloom]
  //   newSpot.Comments = rawObject[Comments]
  //   newSpot.DeleteSurvey = rawObject[DeleteSurvey]
  //   newSpot.CollectionDate1 = rawObject[CollectionDate1]
  //   newSpot.TrappingInterval1 = rawObject[TrappingInterval1]
  //   newSpot.Number_SPB1 = rawObject[Number_SPB1]
  //   newSpot.Number_Clerids1 = rawObject[Number_Clerids1]
  //   newSpot.SPB_Plus_Clerids1 = rawObject[SPB_Plus_Clerids1]
  //   newSpot.Percent_SPB1 = rawObject[Percent_SPB1]
  //   newSpot.SPB_PerDay1 = rawObject[SPB_PerDay1]
  //   newSpot.Clerids_PerDay1 = rawObject[Clerids_PerDay1]
  //   newSpot.CollectionDate2 = rawObject[CollectionDate2]
  //   newSpot.TrappingInterval2 = rawObject[TrappingInterval2]
  //   newSpot.Number_SPB2 = rawObject[Number_SPB2]
  //   newSpot.Number_Clerids2 = rawObject[SPB]
  //   newSpot.SPB_Plus_Clerids2 = rawObject[SPB]
  //   newSpot.Percent_SPB2 = rawObject[SPB]
  //   newSpot.SPB_PerDay2 = rawObject[SPB]
  //   newSpot.Clerids_PerDay2 = rawObject[SPB]
  //   newSpot.CollectionDate3 = rawObject[SPB]
  //   newSpot.TrappingInterval3 = rawObject[SPB]
  //   newSpot.Number_SPB3 = rawObject[SPB]
  //   newSpot.Number_Clerids3 = rawObject[SPB]
  //   newSpot.SPB_Plus_Clerids3 = rawObject[SPB]
  //   newSpot.Percent_SPB3 = rawObject[SPB]
  //   newSpot.SPB_PerDay3 = rawObject[SPB]
  //   newSpot.Clerids_PerDay3 = rawObject[Clerids_PerDay3]
  //   newSpot.CollectionDate4 = rawObject[CollectionDate4]
  //   newSpot.TrappingInterval4 = rawObject[TrappingInterval4]
  //   newSpot.Number_SPB4 = rawObject[Number_SPB4]
  //   newSpot.Number_Clerids4 = rawObject[Number_Clerids4]
  //   newSpot.SPB_Plus_Clerids4 = rawObject[SPB_Plus_Clerids4]
  //   newSpot.Percent_SPB4 = rawObject[Percent_SPB4]
  //   newSpot.SPB_PerDay4 = rawObject[SPB_PerDay4]
  //   newSpot.Clerids_PerDay4 = rawObject[Clerids_PerDay4]
  //   newSpot.CollectionDate5 = rawObject[CollectionDate5]
  //   newSpot.TrappingInterval5 = rawObject[TrappingInterval5]
  //   newSpot.Number_SPB5 = rawObject[Number_SPB5]
  //   newSpot.Number_Clerids5 = rawObject[Number_Clerids5]
  //   newSpot.SPB_Plus_Clerids5 = rawObject[SPB_Plus_Clerids5]
  //   newSpot.Percent_SPB5 = rawObject[Percent_SPB5]
  //   newSpot.SPB_PerDay5 = rawObject[SPB_PerDay5]
  //   newSpot.Clerids_PerDay5 = rawObject[Clerids_PerDay5]
  //   newSpot.CollectionDate6 = rawObject[CollectionDate6]
  //   newSpot.TrappingInterval6 = rawObject[TrappingInterval6]
  //   newSpot.Number_SPB6 = rawObject[Number_SPB6]
  //   newSpot.Number_Clerids6 = rawObject[Number_Clerids6]
  //   newSpot.SPB_Plus_Clerids6 = rawObject[SPB_Plus_Clerids6]
  //   newSpot.Percent_SPB6 = rawObject[Percent_SPB6]
  //   newSpot.SPB_PerDay6 = rawObject[SPB_PerDay6]
  //   newSpot.Clerids_PerDay6 = rawObject[Clerids_PerDay6]
  //   newSpot.Sum_TrappingInterval = rawObject[Sum_TrappingInterval]
  //   newSpot.Sum_SPB = rawObject[Sum_SPB]
  //   newSpot.Sum_Clerids = rawObject[Sum_Clerids]
  //   newSpot.Sum_SPB_Plus_Clerids = rawObject[Sum_SPB_Plus_Clerids]
  //   newSpot.Overall_PercentSPB = rawObject[Overall_PercentSPB]
  //   newSpot.Overall_SPB_PerDay = rawObject[Overall_SPB_PerDay]
  //   newSpot.Overall_Clerids_PerDay = rawObject[Overall_Clerids_PerDay]
  //   newSpot.CreationDate = rawObject[CreationDate]
  //   newSpot.Creator = rawObject[Creator]
  //   newSpot.EditDate = rawObject[EditDate]
  //   newSpot.Editor = rawObject[Editor]
  //   newSpot.Trapping_End_Date = rawObject[Trapping_End_Date]
  //   newSpot.Num_Weeks_Trapping = rawObject[Num_Weeks_Trapping]
  //
  //   dataArray.push(newSpot);
  // });
  //
  // Spot.insertMany(dataArray,
  //   {ordered: false},
  //   (err, docs) => {
  //     if (err) {
  //       console.log(err)
  //     }
  //   });

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
};


export const editField = (sampleId, field, newValue) => {
	SampleData.findOne({ _id: sampleId }).then((example) => {
		example.field = newValue;
		return example.save();
	});
};


const controller = { uploadSpotData };
export default controller;
