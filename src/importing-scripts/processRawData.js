import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';

//Use to process array of data in schema spots_v2 format
const formatToSpot = (data) => {
  var currentYear = new Date().getFullYear();
  console.log("data = " + data);
  // var counties = []; //tracking, {county, state}
  // var traps = []; //error checking
  var countyTrapTotals = []; //{county, state, countTraps}
  var countyTrapSeen = []; //{county, state, countTrapsSeen}

  var formattedSpotArray = [];

  /*Generate tracking array countryTrapTotals*/
  //for each data point from Survey123...
  for (var i = 0; i<data.length; i++) {

    //add objectID checking

    //if current year
    if (parseInt(data[i].Year) === currentYear) {
      // console.log("made it into if statement!");
      //Set up
      var found = false; //have u found a match in the tracking array?
      var observation = data[i];
      // console.log("observation county = " + observation.County);
      // console.log("observation state = " + observation.USA_State);
      // console.log("observation objectID = " + observation.objectid);

      //Search for matching county in tracking array
      for (var j = 0; j<countyTrapTotals.length; j++) {
        // console.log("hello world!");
        //if {county, state} DOES exist in array...
        if ((countyTrapTotals[j].county === observation.County) && (countyTrapTotals[j].state === observation.USA_State)) {
            //set found to true, since we found it
            found = true;
            //increment count associated w the point
            countyTrapTotals[j].traps = countyTrapTotals[j].traps + 1;
            break; //stop searching countyTrapTotals for the county-state
        }
      }
      if (found === false) { //if found = false we still havent found it
        //create a temp JS object
        var countyTemp = observation.County;
        var stateTemp = observation.USA_State;
        var addMe = {county: countyTemp, state: stateTemp, traps: 1};
        console.log(found);
        console.log(addMe);
        //add it to the tracking array
        countyTrapTotals.push(addMe);
      }
    }
  }

  // console.log("countyTrapTotals = " + countyTrapTotals);
  //Error Checking
  // for (var i = 0; i < countyTrapTotals.length; i++) {
  //   console.log(countyTrapTotals[i].county);
  //   console.log(countyTrapTotals[i].state);
  //   console.log(countyTrapTotals[i].traps);
  //   console.log("\n");
  // }
  //
  // //Error Checking
  // console.log("data length = " + data.length);
  // console.log("countyTrapTotals length = " + countyTrapTotals.length);

  //Error Checking
  var sum = 0;
  for (var i = 0; i < countyTrapTotals.length; i++) {
    sum = sum + countyTrapTotals[i].traps;
  }
  // console.log("data length = " + data.length);
  // console.log("traps found = " + sum);
  var diff = data.length - sum;
  console.log(diff + " points had critical fields that were null. We were unable to add them to the database as a result");
  //add year differencer

  /* Generate empty spots with county and state indicators */
  //For each county-state combo in countyTrapTotals
  for (var i = 0; i<countyTrapTotals.length; i++) {
    const newProcessedSpot = {};

    newProcessedSpot.county = countyTrapTotals[i].county; //need to map these to forests
    newProcessedSpot.state = countyTrapTotals[i].state;
    // newProcessedSpot.spbPerTwoWeeks = null;
    // newProcessedSpot.cleridsPerTwoWeeks = null;
    // newProcessedSpot.spots = null;
    // newProcessedSpot.spotsPerHundredKm = null;
    // newProcessedSpot.percentSpb = null;

    formattedSpotArray.push(newProcessedSpot);
  }

  /* Fill spots */
  //For each data point...
  for (var i = 0; i < data.length; i++) {
    //add objectID checking

    //if from this year...
    if (parseInt(data[i].Year) === currentYear) {

      var observation = data[i];
      // console.log("num trapping weeks = " + observation.Num_Trapping_Periods);

      let tempspbPerTwoWeeks = 0;
      let tempcleridsPerTwoWeeks = 0;

      //Find spot that matches county-state
      for (var j = 0; j < formattedSpotArray.length; j++) {
        var spot = formattedSpotArray[j];

        //if spot matches county and state of data point...
        if((spot.county === observation.County) && (spot.state === observation.USA_State)) {

          //try to find matching object in SEEN tracking array
          var found2 = false; //found2 indicates whether or not you've found a match in countyTrapSeen
          for (var k = 0; k < countyTrapSeen.length; k++) {

            //if we have seen a trap from this county-state before...
            if ((countyTrapSeen[k].county === spot.county) && (countyTrapSeen[k].state === spot.state)) {
              console.log("in if statement! 125");
              found2 = true; //set found2 to true to show that we found it (for error checking)

              //calculate values for this trap...
              tempspbPerTwoWeeks = ((observation.Number_SPB1 + observation.Number_SPB2) + (observation.Number_SPB3 + observation.Number_SPB4) + (observation.Number_SPB5 + observation.Number_SPB6))/(observation.Num_Trapping_Periods / 2);;
              tempcleridsPerTwoWeeks = ((observation.Number_Clerids1 + observation.Number_Clerids2) + (observation.Number_Clerids3 + observation.Number_Clerids4) + (observation.Number_Clerids5 + observation.Number_Clerids6))/(observation.Num_Trapping_Periods / 2);
              // tempspots = ;
              // tempspotsPerHundredKm = ;
              // temppercentSpb = ;

              //add in this trap...
              spot.spbPerTwoWeeks = spot.spbPerTwoWeeks + tempspbPerTwoWeeks;
              spot.cleridsPerTwoWeeks = spot.cleridsPerTwoWeeks + tempcleridsPerTwoWeeks;
              // spot.spots = spot.spots + tempspots;
              // spot.spotsPerHundredKm = spot.spotsPerHundredKm + tempspotsPerHundredKm;
              // spot.percentSpb = spot.percentSpb + temppercentSpb;

              //if we are in the last round of traps for the county-state, then divde by number of trap
              //may need another for loop for countyTrapTotals
              if((countyTrapSeen[k].traps === countyTrapTotals[k].traps)) {
                console.log("in if statement! 145");
                console.log("completed " + countyTrapSeen[k].county + " " + countyTrapSeen[k].state);
                //Scale based on number of traps
                spot.spbPerTwoWeeks = (spot.spbPerTwoWeeks / countyTrapTotals[k].traps);
                spot.cleridsPerTwoWeeks = (spot.cleridsPerTwoWeeks / countyTrapTotals[k].traps);
                // spot.spots = spot.spots / countyTrapTotals[k].traps;
                // spot.spotsPerHundredKm = spot.spotsPerHundredKm / countyTrapTotals[k].traps;
                // spot.percentSpb = spot.percentSpb / countyTrapTotals[k].traps;
              }
              //if we are NOT in the last round of traps for the county-state
              else {
                // increment SEEN
                countyTrapSeen[k].traps = countyTrapSeen[k].traps + 1;
              }
              break;
            }

          }
          //if we haven't seen a trap from this county-state before...
          if (found2 === false) { //then found2 will be false
            console.log("in if statement! 165");
            //add to countyTrapSeen array
            //create a temp JS object
            var countyTemp = observation.County;
            var stateTemp = observation.USA_State;
            var addMeSeen = {county: countyTemp, state: stateTemp, traps: 1}; //1 indicates that we've seen this county once
            //add it to the tracking array
            countyTrapSeen.push(addMeSeen);

            /*do calculations*/
            //calculate values for this trap...
            tempspbPerTwoWeeks = ((observation.Number_SPB1 + observation.Number_SPB2) + (observation.Number_SPB3 + observation.Number_SPB4) + (observation.Number_SPB5 + observation.Number_SPB6))/(observation.Num_Trapping_Periods / 2);;
            tempcleridsPerTwoWeeks = ((observation.Number_Clerids1 + observation.Number_Clerids2) + (observation.Number_Clerids3 + observation.Number_Clerids4) + (observation.Number_Clerids5 + observation.Number_Clerids6))/(observation.Num_Trapping_Periods / 2);
            // tempspots = ;
            // tempspotsPerHundredKm = ;
            // temppercentSpb = ;

            //create attribute and fill values for this trap...
            spot.spbPerTwoWeeks = tempspbPerTwoWeeks;
            spot.cleridsPerTwoWeeks = tempcleridsPerTwoWeeks;
            // spot.spots = tempspots;
            // spot.spotsPerHundredKm = tempspotsPerHundredKm;
            // spot.percentSpb = temppercentSpb;

            //add categorical vars only once
            spot.latitude = observation.latitude; //add error checking to see if changed from last
            spot.longitude = observation.longitude; //add error checking to see if changed from last
            spot.year = observation.Year;
          }
          console.log("object id = " + observation.objectid);
          console.log("tempspbPerTwoWeeks = " + tempspbPerTwoWeeks);
        }
        //else spot doesn't match so do nothing

        //Now update spot in formattedSpotArray
        formattedSpotArray[j] = spot;
        // formattedSpotArray.splice(j, 1, spot);

      }
    }
  }

  // console.log("DONZO!!!!!");
  // console.log(formattedSpotArray);

  // /* Error checking */
  // //test to see if sum of trap counts by county-states = data.length
  // var count = 0;
  // for (var i = 0; i<countyTrapTotals.length; i++) {
  //   count = count + countyTrapTotals[i].traps;
  // }

  // return (count === data.length); //should return true
  return formattedSpotArray;
}

const Process = { formatToSpot }
export default Process;
