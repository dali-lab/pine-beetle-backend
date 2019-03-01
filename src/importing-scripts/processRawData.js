import HistoricalData from '../models/historical';
import Spot_V2 from '../models/spot_v2';
import Trapping from '../models/trapping';
import * as fs from 'fs';
import axios from "axios";

/*
* Method: formatToSpot()
* Inputs: dataArray in schema spot_v2.js
* Outputs: dataArray in schema historical.js
* Note: Only calculates spbPerTwoWeeks, cleridsPerTwoWeeks, and percentSpb,
* because other fields are calculated in the fall
* Use formatToSpot(dataArray) to process array of data in schema spots_v2 format.
*/
const formatToSpot = (data) => {
  // Set up
  var currentYear = new Date().getFullYear();
  var countyTrapTotals = []; // for tracking, {county, state, countTrapsSeen}
  var countyTrapSeen = []; // for tracking, {county, state, countTrapsSeen}
  var formattedSpotArray = []; //to be returned as processed data array
  var avoidMe = []; //objectids to skip to avoid duplicates
  var usedIDs = [];
  /*
  * Generate object list to aviod
  */
  var avoidMe = [7, 20];

  /*
  * Generate tracking array countryTrapTotals
  */
  //for each data point from Survey123...
  for (var i = 0; i<data.length; i++) {
    usedIDs.push(data[i].objectid); //add me to db in comments

    //add objectID checking

    //if current year
    if ((parseInt(data[i].Year) === currentYear) && (!avoidMe.includes(data[i].objectid))) {
      //Set up
      var found = false; //have u found a match in the tracking array?
      var observation = data[i];

      //Search for matching county in tracking array
      for (var j = 0; j<countyTrapTotals.length; j++) {
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
        //add it to the tracking array
        countyTrapTotals.push(addMe);
      }
    }
  }

  /*
  * Generate empty spots with county and state indicators
  */
  //For each county-state combo in countyTrapTotals...
  for (var i = 0; i<countyTrapTotals.length; i++) {
    //create a new empty spot in JSON format
    const newProcessedSpot = {};

    //create county and state fields
    newProcessedSpot.county = countyTrapTotals[i].county; //need to map these to forests
    newProcessedSpot.state = countyTrapTotals[i].state;

    //push to formattedSpotArray
    formattedSpotArray.push(newProcessedSpot);
  }

  /* Fill spots */
  //For each data point...
  for (var i = 0; i < data.length; i++) {

    //add objectID checking

    //if from this year...
    if ((parseInt(data[i].Year) === currentYear) && (!avoidMe.includes(data[i].objectid))) {

      var observation = data[i]; //for readability

      // Set up temporary vars for calculation
      let tempspbPerTwoWeeks = 0;
      let tempcleridsPerTwoWeeks = 0;
      let temppercentSpb = 0;
      /*NOTE: spots information is collected in the fall, so spots and spotsPerHundredKm should be processed separately*/

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
              found2 = true; //set found2 to true to show that we found it (for error checking)

              //calculate values for this trap...
              tempspbPerTwoWeeks = ((observation.Number_SPB1 + observation.Number_SPB2) + (observation.Number_SPB3 + observation.Number_SPB4) + (observation.Number_SPB5 + observation.Number_SPB6))/(observation.Num_Trapping_Periods / 2);;
              tempcleridsPerTwoWeeks = ((observation.Number_Clerids1 + observation.Number_Clerids2) + (observation.Number_Clerids3 + observation.Number_Clerids4) + (observation.Number_Clerids5 + observation.Number_Clerids6))/(observation.Num_Trapping_Periods / 2);
              temppercentSpb = ((observation.Percent_SPB1 + observation.Percent_SPB2) + (observation.Percent_SPB3 + observation.Percent_SPB4) + (observation.Percent_SPB5 + observation.Percent_SPB6))/(observation.Num_Trapping_Periods / 2);

              //add in this trap...
              spot.spbPerTwoWeeks = spot.spbPerTwoWeeks + tempspbPerTwoWeeks;
              spot.cleridsPerTwoWeeks = spot.cleridsPerTwoWeeks + tempcleridsPerTwoWeeks;
              spot.percentSpb = spot.percentSpb + temppercentSpb;

              //if we are in the last round of traps for the county-state, then divde by number of trap
              //may need another for loop for countyTrapTotals, but it should be the same
              if((countyTrapSeen[k].traps === countyTrapTotals[k].traps)) {
                //Scale based on number of traps
                spot.spbPerTwoWeeks = (spot.spbPerTwoWeeks / countyTrapTotals[k].traps);
                spot.cleridsPerTwoWeeks = (spot.cleridsPerTwoWeeks / countyTrapTotals[k].traps);
                spot.percentSpb = (spot.percentSpb / countyTrapTotals[k].traps);
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
            temppercentSpb = ((observation.Percent_SPB1 + observation.Percent_SPB2) + (observation.Percent_SPB3 + observation.Percent_SPB4) + (observation.Percent_SPB5 + observation.Percent_SPB6))/(observation.Num_Trapping_Periods / 2);

            //create attribute and fill values for this trap...
            spot.spbPerTwoWeeks = tempspbPerTwoWeeks;
            spot.cleridsPerTwoWeeks = tempcleridsPerTwoWeeks;
            spot.percentSpb = temppercentSpb;

            //add categorical vars only once
            spot.latitude = observation.latitude; //add error checking to see if changed from last
            spot.longitude = observation.longitude; //add error checking to see if changed from last
            spot.lure = observation.Trap_Lure; //add error checking to see if changed from last
            spot.year = observation.Year;
          }
        }
        //else spot doesn't match so do nothing

        //Now update spot in formattedSpotArray
        formattedSpotArray[j] = spot;
        // formattedSpotArray.splice(j, 1, spot); //another method of changing the array, useful if debugging

      }
    }
  }

  /*
  * Error checking
  */
  // Test 1: Test to see if sum of trap counts by county-states = data.length
  // var count = 0;
  // for (var i = 0; i<countyTrapTotals.length; i++) {
  //   count = count + countyTrapTotals[i].traps;
  // }

  //Test 2:  View countyTrapTotals
  // for (var i = 0; i < countyTrapTotals.length; i++) {
  //   console.log(countyTrapTotals[i].county);
  //   console.log(countyTrapTotals[i].state);
  //   console.log(countyTrapTotals[i].traps);
  //   console.log("\n");
  // }

  //Test 3:  View countyTrapSeen
  // for (var i = 0; i < countyTrapSeen.length; i++) {
  //   console.log(countyTrapSeen[i].county);
  //   console.log(countyTrapSeen[i].state);
  //   console.log(countyTrapSeen[i].traps);
  //   console.log("\n");
  // }

  //Test 4: Get difference between points considered and points not considered
  //Note: points are not considered when either (1) they are of the wrong year,
  //or (2) they are missing critical fields (like county and state)
  // var sum = 0;
  // for (var i = 0; i < countyTrapTotals.length; i++) {
  //   sum = sum + countyTrapTotals[i].traps;
  // }
  // // console.log("data length = " + data.length);
  // // console.log("traps found = " + sum);
  // var diff = data.length - sum;
  // console.log(diff + " points had critical fields that were null or they were from the wrong time frame. We were unable to add them to the database as a result.");

  /*
  * Aspect data points from consideration by objectid
  */
  // var obj = JSON.parse(json);
  // console.log("hello world!!!!")
  // console.log("obj = " + obj);
  // fs.writeFile('./viewed.json', JSON.stringify(obj), function (err) {
  //   console.log("file writing obj = " + obj);
  //   console.log("file writing error = " + err);
  // });



  return formattedSpotArray;
}

const Process = { formatToSpot }
export default Process;
