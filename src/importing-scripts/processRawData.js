import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';

//Use to process array of data in schema spots_v2 format
const formatToSpot = (data) => {
  // WRAP: if (year == current year) otherwise need to implement year tracking
  // var counties = []; //tracking, {county, state}
  // var traps = []; //error checking
  var countyTrapTotals = []; //{county, state, countTraps}
  var countyTrapSeen = []; //{county, state, countTrapsSeen}

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
  //For each data point
  for (var i = 0; i < data.length; i++) {
    var observation = data[i];
    var found2 = false;

    //Find spot that matches county-state
    for (var j = 0; j < formattedSpotArray.length; j++) {
      var spot = formattedSpotArray[j];
      if((spot.county === observation.County) && (spot.state === observation.USA_State)) {

        for (var k = 0; k < countyTrapSeen.length; k++) {
          //if we have seen a trap from this county-state before...
          if ((countyTrapSeen[k][0] === spot.county) && (countyTrapSeen[k][1] === spot.state) {
            found2 = true;

            //if we are in the last round of traps for the county-state, then divde by max denominator
            //maybe put a console log here
            //if we are not in the last round of traps for the county-state, do nothing

            countyTrapTotals[j][2]++;
            break;
          }
          //if we haven't seen a trap from this county-state before...
          else {
            if (found2 === false) {
              //do stuff...
              //add to array
              //do prelim calculations

            }
          }
        }
      }
      //else spot doesn't match so do nothing
    }
  }

  //Error checking by testing to see if sum of trap counts by county-states = data.length
  var count = 0;
  for (var i = 0; i<countyTrapTotals.length; i++) {
    count = count + countyTrapTotals[i][2];
  }

  return (count === data.length); //should return true
  // return formattedSpotArray;
}

const process = { formatToSpot }
