export default class HistoricalService {

FilterDataByLatLog(queryFields, data){
        // grab start and end year provided by user
    // eslint-disable-next-line prefer-destructuring
    const startDate = queryFields.startDate;
    // eslint-disable-next-line prefer-destructuring
    const endDate = queryFields.endDate;

    const summarizedDataByLatLong = [];

    for (const entry in data) {
      const dataObject = JSON.parse(JSON.stringify(data[entry]));
      const lat = data[entry].latitude;
      const long = data[entry].longitude;

      if (lat !== null && long !== null && lat !== undefined && long !== undefined) {
        const index = findLatLongObject(summarizedDataByLatLong, lat, long);
        const object = summarizedDataByLatLong[index];
        if (object !== null && object !== undefined) {
          object.spots += dataObject.spots;
          object.spotsPerHundredKm += dataObject.spotsPerHundredKm;
          object.spbPerTwoWeeks += dataObject.spbPerTwoWeeks;
          object.cleridsPerTwoWeeks += dataObject.cleridsPerTwoWeeks;

          // update start date
          if (dataObject.year < object.startDate) {
            object.startDate = dataObject.year;
          }

          // update end date
          if (dataObject.year > object.startDate) {
            object.endDate = dataObject.year;
          }

          // add to year array
          if (dataObject.year !== null && dataObject.year !== undefined && dataObject.year !== '' && !object.yearArray.includes(dataObject.year)) {
            object.yearArray.push(dataObject.year);
          }
        } else {
          const newObject = dataObject;

          // set start date and end date
          newObject.startDate = dataObject.year;
          newObject.endDate = dataObject.year;

          // set years array
          const yearArray = [];
          if (newObject.year !== null && newObject.year !== undefined && newObject.year !== '') {
            yearArray.push(newObject.year);
          }
          newObject.yearArray = yearArray;

          summarizedDataByLatLong.push(newObject);
        }
      }
    }

    // if all observations for a lat, long are 0, remove from dataset
    let i = 0;
    while (i < summarizedDataByLatLong.length) {
      if (summarizedDataByLatLong[i].spots === 0 && summarizedDataByLatLong[i].spotsPerHundredKm === 0 && summarizedDataByLatLong[i].spbPerTwoWeeks === 0 && summarizedDataByLatLong[i].cleridsPerTwoWeeks === 0) {
        // remove observation from dataset and year
        summarizedDataByLatLong.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return summarizedDataByLatLong;
}

FilterDataByState(data) {
    const summarizedDataByState = [];

    for (const entry in data) {
      const dataObject = JSON.parse(JSON.stringify(data[entry]));
      // eslint-disable-next-line prefer-destructuring
      const state = data[entry].state;

      if (state !== null && state !== undefined) {
        const index = findStateObject(summarizedDataByState, state);
        const object = summarizedDataByState[index];
        if (object !== null && object !== undefined) {
          object.spots += dataObject.spots;
          object.spotsPerHundredKm += dataObject.spotsPerHundredKm;
          object.spbPerTwoWeeks += dataObject.spbPerTwoWeeks;
          object.cleridsPerTwoWeeks += dataObject.cleridsPerTwoWeeks;
        } else {
          summarizedDataByState.push(dataObject);
        }
      }
    }

    // if all observations for spots, etc. are 0, remove from dataset
    let i = 0;
    while (i < summarizedDataByState.length) {
      if (summarizedDataByState[i].spots === 0 && summarizedDataByState[i].spotsPerHundredKm === 0 && summarizedDataByState[i].spbPerTwoWeeks === 0 && summarizedDataByState[i].cleridsPerTwoWeeks === 0) {
        // remove observation from dataset and year
        summarizedDataByState.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return summarizedDataByState;
}
FilterDataByYear(queryFields, data) {
    const startDate = queryFields.startDate;
    const endDate = queryFields.endDate;

    // summarize data by year
    const summarizedDataByYear = [];

    for (const entry in data) {
      const dataObject = JSON.parse(JSON.stringify(data[entry]));
      const year = data[entry].year;

      if (year !== null && year !== undefined && year !== '') {
        const index = findYearObject(summarizedDataByYear, year);
        const object = summarizedDataByYear[index];
        if (object !== null && object !== undefined) {
          object.spots += dataObject.spots;
          object.spotsPerHundredKm += dataObject.spotsPerHundredKm;
          object.spbPerTwoWeeks += dataObject.spbPerTwoWeeks;
          object.cleridsPerTwoWeeks += dataObject.cleridsPerTwoWeeks;

          // add to state array
          if (dataObject.state !== null && dataObject.state !== undefined && dataObject.state !== '' && !object.state.includes(dataObject.state)) {
            object.state.push(dataObject.state);
          }

          // add to nf array
          if (dataObject.nf !== null && dataObject.nf !== undefined && dataObject.nf !== '' && !object.nf.includes(dataObject.nf)) {
            object.nf.push(dataObject.nf);
          }

          // add to forest array
          if (dataObject.forest !== null && dataObject.forest !== undefined && dataObject.forest !== '' && !object.forest.includes(dataObject.forest)) {
            object.forest.push(dataObject.forest);
          }
        } else {
          const newObject = dataObject;

          // set state to be array
          const stateArray = [];
          if (newObject.state !== null && newObject.state !== undefined && newObject.state !== '') {
            stateArray.push(newObject.state);
          }
          newObject.state = stateArray;

          // set nf to be array
          const nfArray = [];
          if (newObject.nf !== null && newObject.nf !== undefined && newObject.nf !== '') {
            nfArray.push(newObject.nf);
          }
          newObject.nf = nfArray;

          // set forest to be array
          const forestArray = [];
          if (newObject.forest !== null && newObject.forest !== undefined && newObject.forest !== '') {
            forestArray.push(newObject.forest);
          }
          newObject.forest = forestArray;

          summarizedDataByYear.push(dataObject);
        }
      }
    }

    // if all observations for a year are 0, remove from dataset
    let i = 0;
    while (i < summarizedDataByYear.length) {
      if (summarizedDataByYear[i].spots === 0 && summarizedDataByYear[i].spotsPerHundredKm === 0 && summarizedDataByYear[i].spbPerTwoWeeks === 0 && summarizedDataByYear[i].cleridsPerTwoWeeks === 0) {
        // remove observation from dataset and year
        summarizedDataByYear.splice(i, 1);
      } else {
        i += 1;
      }
    }

    // create a collection of values to return
    const valuesToReturn = [null, null, summarizedDataByYear];

    if (summarizedDataByYear.length > 0) {
      // if we deleted the first date, update start date selection
      if (startDate !== summarizedDataByYear[0].year) {
        valuesToReturn[0] = summarizedDataByYear[0].year;
      }
      // if we deleted the last date, update end date selection
      if (endDate !== summarizedDataByYear[summarizedDataByYear.length - 1].year) {
        valuesToReturn[1] = summarizedDataByYear[summarizedDataByYear.length - 1].year;
      }
    }
    return valuesToReturn;
  }
}