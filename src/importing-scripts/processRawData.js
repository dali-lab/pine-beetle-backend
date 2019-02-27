import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';

//Use to process array of data in schema spots_v2 format
const formatToSpot = (data) => {
  let formattedSpotArray = [];

  /* PROBABLY NEED 2 FOR LOOPS TO MAKE THIS WORK FOR BOTH PER 2 WEEKS ISSUES AND PER TRAP ISSUES */
  for (var i = 0; i<data.length; i++) {
    const newProcessedSpot = {};
    observation = data[i];

    //newProcessedSpot.objectIDs = there should probably be a double for loops to calculate this
    // newSpot.yearNumber = this seems like a fake measurement, check out r model to see if necesary;
    newSpot.state = object.USA_State; //add error checking to see if changed from last
    newSpot.nf = object.;
    //newSpot.classification = unimportant? ranger district;
    //newSpot.forest = how do i find this?;
    //newSpot.stateCode = how do i find this?;
    //newSpot.forestCode = how do i find this?;
    newSpot.latitude = object.latitude;
    newSpot.longitude = object.longitude;
    //newSpot.host = what is this?;
    newSpot.year = object.Year;

    //why isn't county included? does nf mean county?

    newSpot.spbPerTwoWeeks = ((object.Number_SPB1 + object.Number_SPB2) + (object.Number_SPB3 + object.Number_SPB4) + (object.Number_SPB5 + object.Number_SPB6))/(object.Num_Weeks_Trapping / 2);
    newSpot.cleridsPerTwoWeeks = ((object.Number_Clerids1 + object.Number_Clerids2) + (object.Number_Clerids3 + object.Number_Clerids4) + (object.Number_Clerids5 + object.Number_Clerids6))/(object.Num_Weeks_Trapping / 2);

    //where does this info come from??
    //newSpot.spots = object.;
    //newSpot.spotsPerHundredKm = object.;
    //newSpot.percentSpb = object.;

  }
}

const process = { formatToSpot }
