import express, {Router} from 'express';
import historical from './controllers/historical_controller';
import controller from './controllers/survey123_controller';
import { makePredictions } from './runRModel';
import math from 'mathjs'; 
import { ObjectUnsubscribedError } from 'rxjs';

const router = express();

// get all items in the database
router.get('/getHistoricals', (req, res) => {
	historical.getHistoricalData().then((data) => {
		res.send(data);
	});
});

// get all items with passed filter
router.post('/getHistoricalsFilter', (req, res) => {
	historical.getHistoricalDataFilter(req.body).then((data) => {
		res.send(data);
	});
});

// get all items with passed filter, then summarize based on year
router.post('/getSummarizedDataByYearFilter', (req, res) => {
	historical.getHistoricalDataFilter(req.body).then((data) => {

		// grab start and end year provided by user
		var startDate = req.body.startDate;
		var endDate = req.body.endDate;

		// summarize data by year
	    var summarizedDataByYear = [];

	    for (var entry in data) {
	        var dataObject = JSON.parse(JSON.stringify(data[entry]))
	        var year = data[entry].year;

	        if (year !== null && year !== undefined && year !== "") {
	            var index = findYearObject(summarizedDataByYear, year);
	            var object = summarizedDataByYear[index];
	            if (object !== null && object !== undefined) {
	                object.spots += dataObject.spots;
	                object.spotsPerHundredKm += dataObject.spotsPerHundredKm;
	                object.spbPerTwoWeeks += dataObject.spbPerTwoWeeks;
	                object.cleridsPerTwoWeeks += dataObject.cleridsPerTwoWeeks;

	                // add to state array
	                if  (dataObject.state !== null && dataObject.state !== undefined && dataObject.state !== "" && !object.state.includes(dataObject.state)) {
	                    object.state.push(dataObject.state)
	                }

	                // add to nf array
	                if  (dataObject.nf !== null && dataObject.nf !== undefined && dataObject.nf !== "" && !object.nf.includes(dataObject.nf)) {
	                    object.nf.push(dataObject.nf)
	                }

	                // add to forest array
	                if  (dataObject.forest !== null && dataObject.forest !== undefined && dataObject.forest !== "" && !object.forest.includes(dataObject.forest)) {
	                    object.forest.push(dataObject.forest)
	                }

	            }
	            else {
	                var newObject = dataObject

	                // set state to be array
	                var stateArray = []
	                if  (newObject.state !== null && newObject.state !== undefined && newObject.state !== "") {
	                    stateArray.push(newObject.state)
	                }
	                newObject.state = stateArray

	                // set nf to be array
	                var nfArray = []
	                if  (newObject.nf !== null && newObject.nf !== undefined && newObject.nf !== "") {
	                    nfArray.push(newObject.nf)
	                }
	                newObject.nf = nfArray

	                // set forest to be array
	                var forestArray = []
	                if  (newObject.forest !== null && newObject.forest !== undefined && newObject.forest !== "") {
	                    forestArray.push(newObject.forest)
	                }
	                newObject.forest = forestArray

	                summarizedDataByYear.push(dataObject)
	            }
	        }
	    }

	    // if all observations for a year are 0, remove from dataset
	    var i = 0;
	    while (i < summarizedDataByYear.length) {
	        if (summarizedDataByYear[i].spots === 0 && summarizedDataByYear[i].spotsPerHundredKm === 0 && summarizedDataByYear[i].spbPerTwoWeeks === 0 && summarizedDataByYear[i].cleridsPerTwoWeeks === 0) {
	            // remove observation from dataset and year
	            summarizedDataByYear.splice(i,1);
	        }
	        else {
	            i += 1;
	        }
	    }

	    // create a collection of values to return
	    var valuesToReturn = [null,null,summarizedDataByYear]

	    if (summarizedDataByYear.length > 0) {
	        // if we deleted the first date, update start date selection
	        if (startDate !== summarizedDataByYear[0].year) {
	            valuesToReturn[0] = summarizedDataByYear[0].year
	        }
	        // if we deleted the last date, update end date selection
	        if (endDate !== summarizedDataByYear[summarizedDataByYear.length - 1].year) {
	            valuesToReturn[1] = summarizedDataByYear[summarizedDataByYear.length - 1].year
	        }
	    }

		res.send(valuesToReturn);
	});
});

const findYearObject = (collection, year) => {
    for (var i in collection) {
        if (collection[i].year === year) {
            return i
        }
    }
    return null;
}

// get all items with passed filter, then summarize based on year
router.post('/getSummarizedDataByLatLongFilter', (req, res) => {
	historical.getHistoricalDataFilter(req.body).then((data) => {

		// grab start and end year provided by user
		var startDate = req.body.startDate;
		var endDate = req.body.endDate;

		var summarizedDataByLatLong = [];

		for (var entry in data) {
			var dataObject = JSON.parse(JSON.stringify(data[entry]))
			var lat = data[entry].latitude;
			var long = data[entry].longitude;

			if (lat !== null && long !== null && lat !== undefined && long !== undefined) {
				var index = findLatLongObject(summarizedDataByLatLong, lat, long);
				var object = summarizedDataByLatLong[index];
				if (object !== null && object !== undefined) {
					object.spots += dataObject.spots;
					object.spotsPerHundredKm += dataObject.spotsPerHundredKm;
					object.spbPerTwoWeeks += dataObject.spbPerTwoWeeks;
					object.cleridsPerTwoWeeks += dataObject.cleridsPerTwoWeeks;

					// update start date
					if (dataObject.year < object.startDate) {
						object.startDate = dataObject.year
					}

					// update end date
					if (dataObject.year > object.startDate) {
						object.endDate = dataObject.year
					}

					// add to year array
					if  (dataObject.year !== null && dataObject.year !== undefined && dataObject.year !== "" && !object.yearArray.includes(dataObject.year)) {
						object.yearArray.push(dataObject.year)
					}

				}
				else {
					var newObject = dataObject;

					// set start date and end date
					newObject.startDate = dataObject.year;
					newObject.endDate = dataObject.year

					// set years array
					var yearArray = []
					if  (newObject.year !== null && newObject.year !== undefined && newObject.year !== "") {
						yearArray.push(newObject.year)
					}
					newObject.yearArray = yearArray

					summarizedDataByLatLong.push(newObject)
				}
			}
		}

		// if all observations for a lat, long are 0, remove from dataset
		var i = 0;
		while (i < summarizedDataByLatLong.length) {
			if (summarizedDataByLatLong[i].spots === 0 && summarizedDataByLatLong[i].spotsPerHundredKm === 0 && summarizedDataByLatLong[i].spbPerTwoWeeks === 0 && summarizedDataByLatLong[i].cleridsPerTwoWeeks === 0) {
				// remove observation from dataset and year
				summarizedDataByLatLong.splice(i,1);
			}
			else {
				i += 1;
			}
		}

		res.send(summarizedDataByLatLong);
	});
});

const findLatLongObject = (collection, lat, long) => {
	for (var i in collection) {
		if (collection[i].latitude === lat && collection[i].longitude === long) {
			return i
		}
	}
	return null;
}

// get all items with passed filter, then summarize based on year
router.post('/getSummarizedDataByState', (req, res) => {
	historical.getDataForSingleYear(req.body).then((data) => {
		var summarizedDataByState = [];

		for (var entry in data) {
			var dataObject = JSON.parse(JSON.stringify(data[entry]))
			var state = data[entry].state;

			if (state !== null && state !== undefined) {
				var index = findStateObject(summarizedDataByState, state);
				var object = summarizedDataByState[index];
				if (object !== null && object !== undefined) {
					object.spots += dataObject.spots;
					object.spotsPerHundredKm += dataObject.spotsPerHundredKm;
					object.spbPerTwoWeeks += dataObject.spbPerTwoWeeks;
					object.cleridsPerTwoWeeks += dataObject.cleridsPerTwoWeeks;
				}
				else {
					summarizedDataByState.push(dataObject)
				}
			}
		}

		// if all observations for spots, etc. are 0, remove from dataset
		var i = 0;
		while (i < summarizedDataByState.length) {
			if (summarizedDataByState[i].spots === 0 && summarizedDataByState[i].spotsPerHundredKm === 0 && summarizedDataByState[i].spbPerTwoWeeks === 0 && summarizedDataByState[i].cleridsPerTwoWeeks === 0) {
				// remove observation from dataset and year
				summarizedDataByState.splice(i,1);
			}
			else {
				i += 1;
			}
		}

		res.send(summarizedDataByState);
	});
});

const findStateObject = (collection, state) => {
	for (var i in collection) {
		if (collection[i].state === state) {
			return i
		}
	}
	return null;
}

// get the first year present in the database
router.get('/getMinimumYear', (req, res) => {
	historical.getMinimumYear().then((data) => {
		res.send(data[0].year.toString());
	});
});

// get the most recent year present in the database
router.get('/getMaximumYear', (req, res) => {
	historical.getMaximumYear().then((data) => {
		res.send(data[0].year.toString());
	});
});

// get all unique states in the database
router.get('/getUniqueStates', (req, res) => {
	historical.getUniqueStates().then((data) => {
		res.send(data.filter(state => state !== ""));
	});
});

// get all unique years in the database
router.get('/getUniqueYears', (req, res) => {
	historical.getUniqueYears().then((data) => {
		res.send(data.filter(year => year !== ""));
	});
});

// get all unique years in the database
router.post('/getUniqueNationalForests', (req, res) => {
	historical.getUniqueNationalForests(req.body.stateAbbreviation).then((data) => {
		res.send(data.filter(nf => nf !== ""));
	});
});

// get all unique years in the database
router.post('/getUniqueLocalForests', (req, res) => {
	historical.getUniqueLocalForests(req.body.stateAbbreviation).then((data) => {
		res.send(data.filter(forest => forest !== ""));
	});
});

// run the R model on forest if specified, otherwise on entire state
router.post('/getPredictions', (req, res) => {
	historical.getDataForPredictiveModel(req.body).then((data) => {
		// if the user selected a specific national forest or forest, simply run the model
		if ((req.body.nf !== undefined && req.body.nf !== null && req.body.nf !== "") || (req.body.forest !== undefined && req.body.forest !== null && req.body.forest !== "")) {
			// initialize input counts
			var SPB = 0;
			var cleridst1 = 0;
			var spotst1 = 0;
			var spotst2 = 0;
			var endobrev = 1;

			// sum up inputs across these filters
			for (var entry in data) {
				if (data[entry].year === parseInt(req.body.targetYear)) {
					if (data[entry].spbPerTwoWeeks !== undefined) {
						SPB += data[entry].spbPerTwoWeeks;
					}
				}
				if (data[entry].year === parseInt(req.body.targetYear - 1)) {
					if (data[entry].spots !== undefined) {
						spotst1 += data[entry].spots;
					}
					if (data[entry].cleridsPerTwoWeeks !== undefined) {
						cleridst1 += data[entry].cleridsPerTwoWeeks;
					}
				}
				else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
					if (data[entry].spots !== undefined) {
						spotst2 += data[entry].spots;
					}
				}
			}

			// make prediction
			var results = makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev);

			// get results
			var expSpotsIfOutbreak = results[2].Predictions;
			var spots0 = results[3].Predictions;
			var spots19 = results[4].Predictions;
			var spots53 = results[5].Predictions;
			var spots147 = results[6].Predictions;
			var spots402 = results[7].Predictions;
			var spots1095 = results[8].Predictions;

			var predictions = [spots0, spots19, spots53, spots147, spots402, spots1095, expSpotsIfOutbreak]
			var predPromise = Promise.resolve(predictions);

			predPromise.then(function(value){
			  res.send(value);
			});
		}

		// split the data up by forests, run the model each time, average the results
		else {
			// TEMPORARILY DO NOT ALLOW THE USER TO RUN THE MODEL MULTIPLE TIMES -- AVOID CRASHING THE SERVER
			return res.status(400).send({
				message: 'We are not currently allowing multiple concurrent model runs. Please use the getPredictionsOld route.'
			 });

			// // separate all data by forest
			// var forestsData = {}

			// // sum up inputs across these filters
			// for (var entry in data) {
			// 	var forestNames = [data[entry].forest, data[entry].nf]
			// 	var obj = [null,null];

			// 	// repeat for forest and national forest
			// 	for (var i=0; i < obj.length; i++) {
			// 		// if there is a forest to grab, find object, otherwise create one
			// 		if (forestNames[i] !== null && forestNames[i] !== "") {
			// 			if (forestsData[forestNames[i]] !== undefined) {
			// 				obj[i] = forestsData[forestNames[i]]
			// 			}
			// 			else {
			// 				obj[i] = {
			// 					SPB: 0,
			// 					cleridst1: 0,
			// 					spotst1: 0,
			// 					spotst2: 0,
			// 					endobrev: 1
			// 				}
			// 			}
			// 		}

			// 		// if we have an object to grab, get statistics for spb, spots, etc.
			// 		if (obj[i] !== null) {
			// 			if (data[entry].year === parseInt(req.body.targetYear)) {
			// 				if (data[entry].spbPerTwoWeeks !== undefined) {
			// 					obj[i].SPB += data[entry].spbPerTwoWeeks;
			// 				}
			// 			}
			// 			if (data[entry].year === parseInt(req.body.targetYear - 1)) {
			// 				if (data[entry].spots !== undefined) {
			// 					obj[i].spotst1 += data[entry].spots;
			// 				}
			// 				if (data[entry].cleridsPerTwoWeeks !== undefined) {
			// 					obj[i].cleridst1 += data[entry].cleridsPerTwoWeeks;
			// 				}
			// 			}
			// 			else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
			// 				if (data[entry].spots !== undefined) {
			// 					obj[i].spotst2 += data[entry].spots;
			// 				}
			// 			}
			
			// 			forestsData[forestNames[i]] = obj[i];
			// 		}
			// 	}
			// }

			// // initialize a collection of sums
			// var sums = {
			// 	expSpotsIfOutbreak: 0,
			// 	spots0: 0,
			// 	spots19: 0,
			// 	spots53: 0,
			// 	spots147: 0,
			// 	spots402: 0,
			// 	spots1095: 0
			// }

			// // run model on each forest
			// for (var forest in forestsData) {
			// 	// make prediction
			// 	var results = makePredictions(forestsData[forest].SPB, forestsData[forest].cleridst1, forestsData[forest].spotst1, forestsData[forest].spotst2, forestsData[forest].endobrev);

			// 	// get results
			// 	sums.expSpotsIfOutbreak += results[2].Predictions;
			// 	sums.spots0 += results[3].Predictions;
			// 	sums.spots19 += results[4].Predictions;
			// 	sums.spots53 += results[5].Predictions;
			// 	sums.spots147 += results[6].Predictions;
			// 	sums.spots402 += results[7].Predictions;
			// 	sums.spots1095 += results[8].Predictions;
			// }

			// var numForests = Object.keys(forestsData).length;
			// var predictions = [sums.spots0 / numForests, sums.spots19 / numForests, sums.spots53 / numForests, sums.spots147 / numForests, sums.spots402 / numForests, sums.spots1095 / numForests, sums.expSpotsIfOutbreak / numForests]
			// var predPromise = Promise.resolve(predictions);

			// predPromise.then(function(value){
			//   res.send(value);
			// });
		}
  	});
});

router.post('/getPredictionsOld', (req, res) => {
	historical.getDataForPredictiveModel(req.body).then((data) => {
		// initialize input counts
		var SPB = 0;
		var cleridst1 = 0;
		var spotst1 = 0;
		var spotst2 = 0;
		var endobrev = 1;

		// sum up inputs across these filters
		for (var entry in data) {
			if (data[entry].year === parseInt(req.body.targetYear)) {
				if (data[entry].spbPerTwoWeeks !== undefined) {
					SPB += data[entry].spbPerTwoWeeks;
				}
			}
			if (data[entry].year === parseInt(req.body.targetYear - 1)) {
				if (data[entry].spots !== undefined) {
					spotst1 += data[entry].spots;
				}
				if (data[entry].cleridsPerTwoWeeks !== undefined) {
					cleridst1 += data[entry].cleridsPerTwoWeeks;
				}
			}
			else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
				if (data[entry].spots !== undefined) {
					spotst2 += data[entry].spots;
				}
			}
		}

		// make prediction
		var results = makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev);

		// get results
		var expSpotsIfOutbreak = results[2].Predictions;
		var spots0 = results[3].Predictions;
		var spots19 = results[4].Predictions;
		var spots53 = results[5].Predictions;
		var spots147 = results[6].Predictions;
		var spots402 = results[7].Predictions;
		var spots1095 = results[8].Predictions;

		var predictions = [spots0, spots19, spots53, spots147, spots402, spots1095, expSpotsIfOutbreak]
		var predPromise = Promise.resolve(predictions);

		predPromise.then(function(value){
		  res.send(value);
		});
  	});
});

// testing to see where heroku crashes in for-loop
router.post('/getPredictionsState', (req, res) => {
	historical.getDataForPredictiveModel(req.body).then((data) => {
		// separate all data by forest
		var forestsData = {}

		// sum up inputs across these filters
		for (var entry in data) {
			var forestNames = [data[entry].forest, data[entry].nf]
			var obj = [null,null];

			// repeat for forest and national forest
			for (var i=0; i < obj.length; i++) {
				// if there is a forest to grab, find object, otherwise create one
				if (forestNames[i] !== null && forestNames[i] !== "") {
					if (forestsData[forestNames[i]] !== undefined) {
						obj[i] = forestsData[forestNames[i]]
					}
					else {
						obj[i] = {
							SPB: 0,
							cleridst1: 0,
							spotst1: 0,
							spotst2: 0,
							endobrev: 1
						}
					}
				}

				// if we have an object to grab, get statistics for spb, spots, etc.
				if (obj[i] !== null) {
					if (data[entry].year === parseInt(req.body.targetYear)) {
						if (data[entry].spbPerTwoWeeks !== undefined) {
							obj[i].SPB += data[entry].spbPerTwoWeeks;
						}
					}
					if (data[entry].year === parseInt(req.body.targetYear - 1)) {
						if (data[entry].spots !== undefined) {
							obj[i].spotst1 += data[entry].spots;
						}
						if (data[entry].cleridsPerTwoWeeks !== undefined) {
							obj[i].cleridst1 += data[entry].cleridsPerTwoWeeks;
						}
					}
					else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
						if (data[entry].spots !== undefined) {
							obj[i].spotst2 += data[entry].spots;
						}
					}
		
					forestsData[forestNames[i]] = obj[i];
				}
			}
		}

		// grab array of spots values
		var spots = []
		for (var forest in forestsData) {
			spots.push(forestsData[forest].spotst1)
		}

		// compute mean and standard deviation of observed spots
		var meanSpots = math.mean(spots);
		var sdSpots = math.std(spots);

		// get count of number of forests chosen then determine number of forests to run the model on
		var numForests = Object.keys(forestsData).length;
		var numForestsForModel = parseInt(numForests / 4);

		// construct object for forests to run the model on
		var forestsDataForModel = {}
		var forestsAdded = 0;

		// get representative forests to run the model on
		for (var forest in forestsData) {
			if (forestsAdded < numForestsForModel) {
				// determine if this spots value is within one standard deviation of the mean
				if (forestsData[forest].spotst1 >= meanSpots - sdSpots && forestsData[forest].spotst1 <= meanSpots + sdSpots) {
					forestsDataForModel[forest] = forestsData[forest]
					delete forestsData[forest];
					forestsAdded += 1;
				}
			}
		}

		// initialize a collection of sums
		var sums = {
			expSpotsIfOutbreak: 0,
			spots0: 0,
			spots19: 0,
			spots53: 0,
			spots147: 0,
			spots402: 0,
			spots1095: 0
		}

		// run model on each representative forest
		for (var forest in forestsDataForModel) {
			// make prediction
			var results = makePredictions(forestsDataForModel[forest].SPB, forestsDataForModel[forest].cleridst1, forestsDataForModel[forest].spotst1, forestsDataForModel[forest].spotst2, forestsDataForModel[forest].endobrev);

			// get results
			sums.expSpotsIfOutbreak += results[2].Predictions;
			sums.spots0 += results[3].Predictions;
			sums.spots19 += results[4].Predictions;
			sums.spots53 += results[5].Predictions;
			sums.spots147 += results[6].Predictions;
			sums.spots402 += results[7].Predictions;
			sums.spots1095 += results[8].Predictions;
		}

		var predictions = [sums.spots0 / numForestsForModel, sums.spots19 / numForestsForModel, sums.spots53 / numForestsForModel, sums.spots147 / numForestsForModel, sums.spots402 / numForestsForModel, sums.spots1095 / numForestsForModel, sums.expSpotsIfOutbreak / numForestsForModel]
		var predPromise = Promise.resolve(predictions);

		predPromise.then(function(value){
		  res.send(value);
		});
  	});
});

// PREVIOUS IS ALL BELOW
router.get('/getSpots', (req, res) => {
	controller.getSpotData().then((data) => {
		res.send(data);
	});
});

router.get('/getBeetles', (req, res) => {
	controller.getBeetleData().then((data) => {
		res.send(data);
	});
});

router.post('/uploadSurvey123', (req, res) => {
	const data = req.body;
	controller.batchUpload(data).then((uploaded) => {
		res.send(uploaded);
	})
})

router.post('/uploadHistorical', (req, res) => {
	const data = req.body;
	console.log(data)
	historical.uploadHistorical(data).then((uploaded) => {
		res.send(uploaded);
	}).catch((err) => {
		console.log(err)
	})
})

export default router;
