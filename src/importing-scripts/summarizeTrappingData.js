/* eslint-disable no-unused-vars */
/* eslint-disable operator-assignment */
/* eslint-disable no-plusplus */
import * as fs from 'fs';
import axios from 'axios';
import HistoricalData from '../models/historical';
import Trapping from '../models/trapping';

/*
* Method: formatToSpot()
* Inputs: dataArray in schema trappingData.js
* Outputs: dataArray in schema historical.js
* Note: Only calculates spbPerTwoWeeks, cleridsPerTwoWeeks, and percentSpb,
* because other fields are calculated in the fall
* Use formatToSpot(dataArray) to process array of data in schema spots_v2 format.
*/


// Create forest map
const stateAbbrevToStateName = {
  AL: 'Alabama',
  AR: 'Arkansas',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MD: 'Maryland',
  MS: 'Mississippi',
  NC: 'North Carolina',
  NJ: 'New Jersey',
  OK: 'Oklahoma',
  SC: 'South Carolina',
  TN: 'Tennesse',
  TX: 'Texas',
  VA: 'Virginia',
};

// create inverse forest map
const stateNameToStateAbbrev = {
  Alabama: 'AL',
  Arkansas: 'AR',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maryland: 'MD',
  Mississippi: 'MS',
  'North Carolina': 'NC',
  'New Jersey': 'NJ',
  Oklahoma: 'OK',
  'South Carolina': 'SC',
  Tennesse: 'TN',
  Texas: 'TX',
  Virginia: 'VA',
};

/* Generate totals for averages & calculations */
const _generateTotalsAndAverages = (data) => {

  /* Set Up: Generate tracking arrays for traps */
  const countyTrapTotals = []; // for tracking, {county, state, traps} where traps is the total count of traps found for the county-state in data
  const countyTrapSeen = []; // for tracking, {county, state, traps} where traps is the total count of traps seen so far for the county-state in calculation
  const formattedSpotArray = []; // to be returned as processed data array

  // for each ALREADY FILTERED data point from Survey123...
  for (let i = 0; i < data.length; i++) {
    // Set up
    let found = false; // have you found a match in the tracking array?
    const observation = data[i];

    // Search for matching county-state in tracking array
    for (let j = 0; j < countyTrapTotals.length; j++) {
      // if {county, state} DOES exist in array...
      if ((countyTrapTotals[j].county === observation.County) && (countyTrapTotals[j].state === observation.USA_State)) {
        found = true;
        countyTrapTotals[j].traps = countyTrapTotals[j].traps + 1;
        break;
      }
    }
    if (found === false) { 
      const countyTemp = observation.County;
      const stateTemp = observation.USA_State;
      const addMe = { county: countyTemp, state: stateTemp, traps: 1 };
      countyTrapTotals.push(addMe);
    }
  }

  return {
    countyTrapTotals: countyTrapTotals,
    countyTrapSeen: countyTrapSeen,
    formattedSpotArray: formattedSpotArray,
  };
}

/* Generate empty spots with county and state indicators */
const _generateEmptySpots = (countyTrapTotals, formattedSpotArray) => {

  // for each county-state combo in countyTrapTotals
  for (let i = 0; i < countyTrapTotals.length; i++) {
    const newProcessedSpot = {};
    newProcessedSpot.county = countyTrapTotals[i].county;
    newProcessedSpot.state = countyTrapTotals[i].state;
    formattedSpotArray.push(newProcessedSpot);
  }
  return {
    countyTrapTotals: countyTrapTotals,
    formattedSpotArray: formattedSpotArray,
  };
}

const formatToHist = (data) => {

  // Generate Totals and Averages
  const totalsAndAverages = _generateTotalsAndAverages(data);
  const countyTrapTotals = totalsAndAverages.countyTrapTotals;
  const countyTrapSeen = totalsAndAverages.countyTrapSeen;
  const formattedSpotArray = totalsAndAverages.formattedSpotArray;

  // Generate empty spots with county and state indicators
  const emptySpots = _generateTotalsAndAverages(countyTrapTotals, formattedSpotArray);
  const countyTrapTotals = emptySpots.countyTrapTotals;
  const formattedSpotArray = emptySpots.formattedSpotArray;

  /* Fill spots */
  // For each data point...
  for (let i = 0; i < data.length; i++) {
    const observation = data[i]; // for readability

    console.log('observation');
    console.log(observation);
    // Set up temporary vars for calculation
    let tempspbPerTwoWeeks = 0;
    let tempcleridsPerTwoWeeks = 0;
    let temppercentSpb = 0;

    // First, find spot that matches county-state of observation
    for (let j = 0; j < formattedSpotArray.length; j++) {
      const spot = formattedSpotArray[j];

      // if spot matches county and state of data point, then begin calculations...
      if ((spot.county === observation.County) && (spot.state === observation.USA_State)) {
        // keep spacing

        let found2 = false; // found2 indicates whether or not you've found a match in countyTrapSeen
        // try to find matching object in SEEN tracking array
        for (let k = 0; k < countyTrapSeen.length; k++) {
          // if we HAVE seen a trap from this county-state before...
          if ((countyTrapSeen[k].county === spot.county) && (countyTrapSeen[k].state === spot.state)) {
            found2 = true; // set found2 to true to show that we found it (for error checking)

            // update tracking array
            countyTrapSeen[k].traps = countyTrapSeen[k].traps + 1;

            // calculate values for this trap...
            tempspbPerTwoWeeks = ((observation.Number_SPB1 + observation.Number_SPB2) + (observation.Number_SPB3 + observation.Number_SPB4) + (observation.Number_SPB5 + observation.Number_SPB6)) / (observation.Num_Trapping_Periods / 2);
            tempcleridsPerTwoWeeks = ((observation.Number_Clerids1 + observation.Number_Clerids2) + (observation.Number_Clerids3 + observation.Number_Clerids4) + (observation.Number_Clerids5 + observation.Number_Clerids6)) / (observation.Num_Trapping_Periods / 2);
            temppercentSpb = ((observation.Percent_SPB1 + observation.Percent_SPB2) + (observation.Percent_SPB3 + observation.Percent_SPB4) + (observation.Percent_SPB5 + observation.Percent_SPB6)) / (observation.Num_Trapping_Periods / 2);

            // add in this trap to spot values...
            spot.spbPerTwoWeeks += tempspbPerTwoWeeks;
            spot.cleridsPerTwoWeeks += tempcleridsPerTwoWeeks;
            spot.percentSpb += temppercentSpb;

            // if we are in the last round of traps for the county-state, then divde by number of trap
            // may need another for loop for countyTrapTotals, but it should be the same
            for (let q = 0; q < countyTrapTotals.length; q++) {
              if ((countyTrapSeen[k].county === countyTrapTotals[q].county) && (countyTrapSeen[k].state === countyTrapTotals[q].state)) {
                if (countyTrapSeen[k].traps === countyTrapTotals[q].traps) {
                // Scale based on number of traps
                  spot.spbPerTwoWeeks /= countyTrapTotals[q].traps;
                  spot.cleridsPerTwoWeeks /= countyTrapTotals[q].traps;
                  spot.percentSpb /= countyTrapTotals[q].traps;
                }
              }
              // else {
              //   // then we didn't count all the traps yet so keep going
              // }
            }
            break;
          }
        }
        // if we haven't seen a trap from this county-state before in the seen array...
        if (found2 === false) { // then found2 will be false
          // add to countyTrapSeen array
          // create a temp JS object
          const countyTemp = observation.County;
          const stateTemp = observation.USA_State;
          const addMeSeen = { county: countyTemp, state: stateTemp, traps: 1 }; // 1 indicates that we've seen this county once
          // add it to the tracking array
          countyTrapSeen.push(addMeSeen);

          /* add baseline vals to spot */
          // calculate values for this trap...
          tempspbPerTwoWeeks = ((observation.Number_SPB1 + observation.Number_SPB2) + (observation.Number_SPB3 + observation.Number_SPB4) + (observation.Number_SPB5 + observation.Number_SPB6)) / (observation.Num_Trapping_Periods / 2);
          tempcleridsPerTwoWeeks = ((observation.Number_Clerids1 + observation.Number_Clerids2) + (observation.Number_Clerids3 + observation.Number_Clerids4) + (observation.Number_Clerids5 + observation.Number_Clerids6)) / (observation.Num_Trapping_Periods / 2);
          temppercentSpb = ((observation.Percent_SPB1 + observation.Percent_SPB2) + (observation.Percent_SPB3 + observation.Percent_SPB4) + (observation.Percent_SPB5 + observation.Percent_SPB6)) / (observation.Num_Trapping_Periods / 2);

          // create attribute and fill values for this trap...
          spot.spbPerTwoWeeks = tempspbPerTwoWeeks;
          spot.cleridsPerTwoWeeks = tempcleridsPerTwoWeeks;
          spot.percentSpb = temppercentSpb;

          // add categorical vars only once
          spot.latitude = observation.latitude; // add error checking to see if changed from last
          spot.longitude = observation.longitude; // add error checking to see if changed from last
          spot.lure = observation.Trap_Lure; // add error checking to see if changed from last
          spot.year = observation.Year;

          // need to be included in survey by USFS
          if (observation.is_Nat_Forest) {
            const tempState = observation.USA_State;
            spot.state = stateNameToStateAbbrev[tempState];
            // spot.state = tempState;
            spot.forest = `${observation.County.toUpperCase()} ${spot.state}`;
            spot.classification = 'CO';
          } else {
            const tempState = observation.USA_State;
            // spot.state = tempState;
            spot.state = stateNameToStateAbbrev[tempState];
            spot.nf = observation.County.toUpperCase();
            spot.rangerDistrictName = observation.Nat_Forest_Ranger_Dist;
            spot.forest = `${observation.County.toUpperCase()} RD`;
            spot.classification = 'RD';
          }

          // if we are in the last round of traps for the county-state, then divde by number of trap
          // may need another for loop for countyTrapTotals, but it should be the same
          for (let q = 0; q < countyTrapTotals.length; q++) {
            if ((addMeSeen.county === countyTrapTotals[q].county) && (addMeSeen.state === countyTrapTotals[q].state)) {
              if (addMeSeen.traps === countyTrapTotals[q].traps) {
                // Scale based on number of traps
                spot.spbPerTwoWeeks /= countyTrapTotals[q].traps;
                spot.cleridsPerTwoWeeks /= countyTrapTotals[q].traps;
                spot.percentSpb /= countyTrapTotals[q].traps;
              }
            }
            // else {
            //   // then we didn't count all the traps yet so keep going
            // }
          }
        }
      }
      // else spot doesn't match so do nothing

      // Now update spot in formattedSpotArray
      formattedSpotArray[j] = spot;
      // formattedSpotArray.splice(j, 1, spot); //another method of changing the array, useful if debugging
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

  // Test 2:  View countyTrapTotals
  // for (var i = 0; i < countyTrapTotals.length; i++) {
  //   console.log(countyTrapTotals[i].county);
  //   console.log(countyTrapTotals[i].state);
  //   console.log(countyTrapTotals[i].traps);
  //   console.log("\n");
  // }

  // Test 3:  View countyTrapSeen
  // for (var i = 0; i < countyTrapSeen.length; i++) {
  //   console.log(countyTrapSeen[i].county);
  //   console.log(countyTrapSeen[i].state);
  //   console.log(countyTrapSeen[i].traps);
  //   console.log("\n");
  // }

  // Test 4: Get difference between points considered and points not considered
  // Note: points are not considered when either (1) they are of the wrong year,
  // or (2) they are missing critical fields (like county and state)
  // var sum = 0;
  // for (var i = 0; i < countyTrapTotals.length; i++) {
  //   sum = sum + countyTrapTotals[i].traps;
  // }
  // // console.log("data length = " + data.length);
  // // console.log("traps found = " + sum);
  // var diff = data.length - sum;
  // console.log(diff + " points had critical fields that were null or they were from the wrong time frame. We were unable to add them to the database as a result.");

  const promiseFR = Promise.resolve(formattedSpotArray);
  promiseFR.then((value) => {
  });

  return promiseFR;
};

const Process = { formatToHist };
export default Process;