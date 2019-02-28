import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';

//Use to process array of data in schema spots_v2 format
const formatToSpot = (data) => {
  // WRAP: if (year == current year) otherwise need to implement year tracking
  var counties = []; //tracking
  var traps = []; //error checking
  var countyTrapTotals = []; //{county, countTraps}
  var countyTrapSeen = []; //{county, countTrapsSeen}

  //Generate countryTrapTotals
  for (var i = 0; i<data.length; i++) {
    observation = data[i];
    //County
    for (var j = 0; j<countyTrapTotals.length; j++) {
      //if county doesn't exist in array...
      if (!counties.includes(observation.County)) {
        counties.push(observation.County); //tracking
        countyTrapTotals.push({observation.County, 1});
      }
      //if county does exist in array...
      else {
        replaceIndex = countyTrapTotals.findIndex(observation.County);
        countyTrapTotals[replaceIndex][1]++; //increment by 1
      }
    }
  }

  //Generate empty spots

  //Fill spots

}

const process = { formatToSpot }
