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
  var found = false;

  //Generate countryTrapTotals
  for (var i = 0; i<data.length; i++) {
    observation = data[i];
    //County
    for (var j = 0; j<countyTrapTotals.length; j++) {
      //if {county, state} DOES exist in array...
      if ((countyTrapTotals[j][0] === observation.County) && (countyTrapTotals[j][1] === observation.USA_State)) {
          found = true;
          countyTrapTotals[j][2]++;
          break;
      } else {
        if (found === true) { //if we haven't already found {county, state}
          var addMe = {observation.County, observation.USA_State, 1};
          countyTrapTotals.push(addMe);
        }
      }
    }
  }

  //Generate empty spots
  for (var i = 0; i<countyTrapTotals.length; i++) {
    const newProcessedSpot = {};
    newProcessedSpot.county = observation.County; //need to map these to forests
    newProcessedSpot.state = observation.USA_State;

  }

  //Fill spots

}

const process = { formatToSpot }
