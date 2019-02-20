import express, {Router} from 'express';
import math from 'mathjs';
import historical from './controllers/historical_controller';
import controller from './controllers/survey123_controller_v2';
import { makePredictions } from './runRModel';
import upload from './importing-scripts/uploadSurvey123toMongo';

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
	// if user did not specify a state, return 400
	if (req.body.state === null || req.body.state === undefined) {
		return res.status(400).send({
			message: 'Cannot run the model on the entire nation. Please specify a state and/or forest.'
		 });
	}
	else {
		historical.getDataForPredictiveModel(req.body).then((data) => {
			// if the user selected a specific national forest or forest, simply run the model
			if ((req.body.nf !== undefined && req.body.nf !== null && req.body.nf !== "") || (req.body.forest !== undefined && req.body.forest !== null && req.body.forest !== "")) {
				// initialize input counts
				var modelInputs = {
					SPB: 0,
					cleridst1: 0,
					spotst1: 0,
					spotst2: 0,
					stateCode: 0,
					forestCode: 0
				}

				// sum up inputs across these filters
				for (var entry in data) {
					modelInputs.stateCode = data[entry].stateCode
					modelInputs.forestCode = data[entry].forestCode

					if (data[entry].year === parseInt(req.body.targetYear)) {
						if (data[entry].spbPerTwoWeeks !== undefined) {
							modelInputs.SPB += data[entry].spbPerTwoWeeks;
						}
					}
					if (data[entry].year === parseInt(req.body.targetYear - 1)) {
						if (data[entry].spots !== undefined) {
							modelInputs.spotst1 += data[entry].spots;
						}
						if (data[entry].cleridsPerTwoWeeks !== undefined) {
							modelInputs.cleridst1 += data[entry].cleridsPerTwoWeeks;
						}
					}
					else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
						if (data[entry].spots !== undefined) {
							modelInputs.spotst2 += data[entry].spots;
						}
					}
				}

				// make prediction
				var results = makePredictions(modelInputs.SPB, modelInputs.cleridst1, modelInputs.spotst1, modelInputs.spotst2, 1);

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
					// put model outputs into JSON object
					var outputs = {
						prob0spots: value[0],
						prob19spots: value[1],
						prob53spots: value[2],
						prob147spots: value[3],
						prob402spots: value[4],
						prob1095spots: value[5],
						expSpotsIfOutbreak: value[6]
					}

					res.send({
						inputs: modelInputs,
						outputs: outputs
					});
				});
			}

			// split the data up by forests, determine representative forests of the sample, run the model on only representative forests
			else {
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

				var outputSums = {
					SPB: 0,
					cleridst1: 0,
					spotst1: 0,
					spotst2: 0
				}

				// run model on each representative forest
				for (var forest in forestsDataForModel) {
					// add to outputSums
					outputSums.SPB += forestsDataForModel[forest].SPB;
					outputSums.cleridst1 += forestsDataForModel[forest].cleridst1;
					outputSums.spotst1 += forestsDataForModel[forest].spotst1;
					outputSums.spotst2 += forestsDataForModel[forest].spotst2;

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

				// get average model inputs
				var averageModelInputs = {
					SPB: outputSums.SPB / numForestsForModel,
					cleridst1: outputSums.cleridst1 / numForestsForModel,
					spotst1: outputSums.spotst1 / numForestsForModel,
					spotst2: outputSums.spotst2 / numForestsForModel
				}

				var predictions = [sums.spots0 / numForestsForModel, sums.spots19 / numForestsForModel, sums.spots53 / numForestsForModel, sums.spots147 / numForestsForModel, sums.spots402 / numForestsForModel, sums.spots1095 / numForestsForModel, sums.expSpotsIfOutbreak / numForestsForModel]
				var predPromise = Promise.resolve(predictions);

				predPromise.then(function(value){
					// put model outputs into JSON object
					var outputs = {
						prob0spots: value[0],
						prob19spots: value[1],
						prob53spots: value[2],
						prob147spots: value[3],
						prob402spots: value[4],
						prob1095spots: value[5],
						expSpotsIfOutbreak: value[6]
					}

					res.send({
						inputs: averageModelInputs,
						outputs: outputs
					});
					// res.send(value);
				});
			}
		});
	}
});

router.post('/getCustomPredictions', (req, res) => {
	// get model inputs
	var SPB = parseInt(req.body.SPB);
	var cleridst1 = parseInt(req.body.cleridst1);
	var spotst1 = parseInt(req.body.spotst1);
	var spotst2 = parseInt(req.body.spotst2);
	var endobrev = 1;

	// make prediction
	var results = makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev);

	// grab results
	var expSpotsIfOutbreak = results[2].Predictions;
	var spots0 = results[3].Predictions;
	var spots19 = results[4].Predictions;
	var spots53 = results[5].Predictions;
	var spots147 = results[6].Predictions;
	var spots402 = results[7].Predictions;
	var spots1095 = results[8].Predictions;

	// resolve promise
	var predictions = [spots0, spots19, spots53, spots147, spots402, spots1095, expSpotsIfOutbreak]
	var predPromise = Promise.resolve(predictions);

	predPromise.then(function(value){
		// put model outputs into JSON object
		var outputs = {
			prob0spots: value[0],
			prob19spots: value[1],
			prob53spots: value[2],
			prob147spots: value[3],
			prob402spots: value[4],
			prob1095spots: value[5],
			expSpotsIfOutbreak: value[6]
		}

	  res.send(outputs);
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

router.get('/uploadSurvey123', (req, res) => {

	//Debug
	console.log('uploadSurvey123 running');
	res.send('uploadSurvey123 running');

	// const data = upload.getData();
	// console.log("data " + data);
	// controller.uploadSpotData(data);


	//get the data from S123 using axios, then with that...
	upload.getData().then((data) => {
		//what IS the data???
		console.log("data " + data);

		//check and filter if we already have the data

		//run uploadSpotData to upload data to db, then report to user
		// controller.uploadSpotData(data);
		controller.uploadSpotData(data).then((uploaded) => {
			console.log("uploaded " + uploaded);
			res.send(uploaded);
		}).catch((err) => {
			console.log("err: " + err)
		})

	}).catch((err) => {
		console.log("err: " + err);
	})

	// controller.uploadSpotData(data).then((uploaded) => {
	// 	console.log("uploaded " + uploaded);
	// 	res.send(uploaded);
	// }).catch((err) => {
	// 	console.log("err" + err)
	// })

	// const data = req.body;
	// controller.batchUpload(data).then((uploaded) => {
	// 	res.send(uploaded);
	// })

})

router.post('/uploadSurvey123Fake', (req, res) => {
	res.send([{
			hello: "world",
			test: 1
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},
		{
			hello: "world",
			test: 2
		},

	]);
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
