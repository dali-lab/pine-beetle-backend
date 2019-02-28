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

            //calculate values for this trap...
            tempspbPerTwoWeeks = ((object.Number_SPB1 + object.Number_SPB2) + (object.Number_SPB3 + object.Number_SPB4) + (object.Number_SPB5 + object.Number_SPB6))/(object.Num_Weeks_Trapping / 2);;
            tempcleridsPerTwoWeeks = ((object.Number_Clerids1 + object.Number_Clerids2) + (object.Number_Clerids3 + object.Number_Clerids4) + (object.Number_Clerids5 + object.Number_Clerids6))/(object.Num_Weeks_Trapping / 2);
            // tempspots = ;
            // tempspotsPerHundredKm = ;
            // temppercentSpb = ;

            //add in this trap...
            newSpot.spbPerTwoWeeks = newSpot.spbPerTwoWeeks + tempspbPerTwoWeeks;
            newSpot.cleridsPerTwoWeeks = newSpot.cleridsPerTwoWeeks + tempcleridsPerTwoWeeks;
            newSpot.spots = newSpot.spots + tempspots;
            newSpot.spotsPerHundredKm = newSpot.spotsPerHundredKm + tempspotsPerHundredKm;
            newSpot.percentSpb = newSpot.percentSpb + temppercentSpb;

            //if we are in the last round of traps for the county-state, then divde by max denominator
            if((countyTrapSeen[k][2] = countyTrapTotals[k][2])) {
              console.log("completed " + countyTrapSeen[k][0] + " " + countyTrapSeen[k][1]);
              //Scale based on number of traps
              newSpot.spbPerTwoWeeks = newSpot.spbPerTwoWeeks / countyTrapTotals[k][0];
              newSpot.cleridsPerTwoWeeks = newSpot.cleridsPerTwoWeeks / countyTrapTotals[k][0];
              newSpot.spots = newSpot.spots / countyTrapTotals[k][0];
              newSpot.spotsPerHundredKm = newSpot.spotsPerHundredKm / countyTrapTotals[k][0];
              newSpot.percentSpb = newSpot.percentSpb / countyTrapTotals[k][0];

            }
            countyTrapTotals[j][2]++;
            break;
          }
          //if we haven't seen a trap from this county-state before...
          else {
            if (found2 === false) {
              //do stuff...
              //add to countyTrapSeen array
              //do prelim calculations

              spot.latitude = object.latitude; //add error checking to see if changed from last
              spot.longitude = object.longitude; //add error checking to see if changed from last
              spot.year = object.Year;
            }
          }
        }
      }
      //else spot doesn't match so do nothing

      //Now update spot in formattedSpotArray
      var formattedSpotArray[j] = spot;

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
