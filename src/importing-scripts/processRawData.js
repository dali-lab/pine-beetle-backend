import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';

//Use to process array of data in schema spots_v2 format
const formatToSpot = (data) => {
  var counties = [];
  var trapNames = [];
  var trapsPerCounty = []; //{country, trapCount}
  var trapsSeenPerCounty = []; //{country, trapCountSeen}

  let formattedSpotArray = [];

  //generate set of empty data points on correct level
  for (var i = 0; i<data.length; i++) {
    observation = data[i];

    //calculate trap count per county
    if (!trapNames.includes(observation.Trap_name)) {
      trapNames.push(observation.Trap_name);
      trapsPerCounty.push({observation.Trap_name, 1});
    }

    if (trapNames.includes(observation.Trap_name)) {
      for (var j = 0; j<trapsPerCounty.length; j++) {
        if (trapsPerCounty[j][0] == observation.Trap_name) {
          trapsPerCounty[j][1] = trapsPerCounty[j][1] + 1;
        }
      }
    }



    //generate empty spots
    if (!counties.includes(observation.County)) { //if we haven't seen this county
      counties.push(observation.County);

      //fill basic fields
      const newProcessedSpot = {};
      newProcessedSpot.county = observation.County; //need to map these to forests
      newProcessedSpot.state = observation.USA_State;

      //fill fields for calculation
      for (var k = 0; k < )

      formattedSpotArray.push(newProcessedSpot);
    }
  }

  //fill data points with matching calculated information
  for (var i = 0; i<formattedSpotArray.length; i++) {
    var spot = formattedSpotArray[i];

    for (var j = 0; j<data.length; j++) {
      observation = data[j];

      //If data matches spot
      if ((spot.county = observation.county) && (spot.state = observation.state)) {

        newSpot.state = object.USA_State; //add error checking to see if changed from last
        //newSpot.nf = need to match from county && state;
        //newSpot.classification = unimportant? ranger district;
        //newSpot.forest = need to match from county && state;
        //newSpot.stateCode = how do i find this?;
        //newSpot.forestCode = how do i find this?;
        newSpot.latitude = object.latitude; //add error checking to see if changed from last
        newSpot.longitude = object.longitude; //add error checking to see if changed from last
        //newSpot.host = what is this?;
        newSpot.year = object.Year; //add error checking to see if changed from last

        //why isn't county included? does nf mean county?

        var trapLevelspbPerTwoWeeks = ((object.Number_SPB1 + object.Number_SPB2) + (object.Number_SPB3 + object.Number_SPB4) + (object.Number_SPB5 + object.Number_SPB6))/(object.Num_Weeks_Trapping / 2);
          // newSpot.spbPerTwoWeeks = trapLevelspbPerTwoWeeks /
        }


        newSpot.cleridsPerTwoWeeks = ((object.Number_Clerids1 + object.Number_Clerids2) + (object.Number_Clerids3 + object.Number_Clerids4) + (object.Number_Clerids5 + object.Number_Clerids6))/(object.Num_Weeks_Trapping / 2);

        //where does this info come from??
        //newSpot.spots = object.;
        //newSpot.spotsPerHundredKm = object.;
        //newSpot.percentSpb = object.;


      }

    }
  }


  /* PROBABLY NEED 2 FOR LOOPS TO MAKE THIS WORK FOR BOTH PER 2 WEEKS ISSUES AND PER TRAP ISSUES */

  /* for (var i = 0; i<data.length; i++) {
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
    */

  }
}

const process = { formatToSpot }
