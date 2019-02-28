import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';

//Use to process array of data in schema spots_v2 format
const formatToSpot = (data) => {
  // WRAP: if (year == current year) otherwise need to implement year tracking
  // var counties = []; //tracking, {county, state}
  // var traps = []; //error checking
  var countyTrapTotals = []; //{county, state, countTraps}
  var countyTrapSeen = []; //{county, countTrapsSeen}

  var formattedSpotArray = [];

  //Generate countryTrapTotals
  for (var i = 0; i<data.length; i++) {
    //Set up
    var found = false;
    observation = data[i];

    //County
    for (var j = 0; j<countyTrapTotals.length; j++) {
      //if {county, state} DOES exist in array...
      if ((countyTrapTotals[j][0] === observation.County) && (countyTrapTotals[j][1] === observation.USA_State)) {
          found = true;
          countyTrapTotals[j][2]++;
          break;
      } else {
        if (found === false) { //if we haven't already found {county, state}
          var addMe = {observation.County, observation.USA_State, 1};
          countyTrapTotals.push(addMe);
        }
      }
    }
  }

  //Generate empty spots with county and state indicators
  for (var i = 0; i<countyTrapTotals.length; i++) {
    const newProcessedSpot = {};
    newProcessedSpot.county = countyTrapTotals[i][0]; //need to map these to forests
    newProcessedSpot.state = countyTrapTotals[i][2];
    formattedSpotArray.push(newProcessedSpot);
  }

  //Fill spots
  for (var i = 0; i < data.length; i++) {
    var observation = data[i];
  }

}

const process = { formatToSpot }
