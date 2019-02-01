import express, {Router} from 'express';
import historical from './controllers/historical_controller';
import controller from './controllers/survey123_controller';
import { makePredictions } from './runRModel';

const router = express();

<<<<<<< HEAD
// get all items in the database
=======
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
router.get('/getHistoricals', (req, res) => {
	historical.getHistoricalData().then((data) => {
		res.send(data);
	});
});

<<<<<<< HEAD
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
				var index = findLocationObject(summarizedDataByLatLong, lat, long);
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

const findLocationObject = (collection, lat, long) => {
	for (var i in collection) {
		if (collection[i].latitude === lat && collection[i].longitude === long) {
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


router.get('/getPredictions', (req, res) => {
	historical.getHistoricalData().then((data) => {

    //TODO: Implement express body-parser
    //Plan:
    // 1- Use body-parse to grab filters
    // 2- Filter data
    // 3- Retrieve (array of) SPB, cleridst1, spotst1, spotst2, endobrev
    // 4- Run model and store inputs
    // 4.5- Run model multiple times if need be (discuss implementation options), keep only average of results
    // 5- Pass results to frontend

    // Filters
  	// const year = req.body["Year"];
  	// const state = req.body["cleridst1"];
  	// const BANKHEAD = req.body["spotst1"];
  	// const classification = req.body["spotst2"];
  	// const forest = req.body["endobrev"];
    // others??

    //Using windowed data, retrieve...
    // obj.spbPerTwoWeeks
    // cleridst1 = obj.cleridsPerTwoWeeks
    // spotst1 = obj.spots (year before selected year)
    // spotst2 = obj.spots (year selected)
    // endobrev?

    //Now pass results to model

    //Running on hard coded data, temporary
    const SPB = 2000;
  	const cleridst1 = 582;
  	const spotst1 = 1006;
  	const spotst2 = 400;
  	const endobrev = 1;

    var predictions = new Promise(function(resolve, reject) {
      resolve(makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev));
    });

    predictions.then(function(value){
      // console.log(value);
      res.send(value);
    });
  });
});

// PREVIOUS IS ALL BELOW
=======
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
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

<<<<<<< HEAD
=======
router.get('/getPredictions', (req, res) => {
	// const { SPB, cleridst1, spotst1, spotst2, endobrev } = req.body; //es6 support not working?
	const SPB = req.body["SPB"];
	const cleridst1 = req.body["cleridst1"];
	const spotst1 = req.body["spotst1"];
	const spotst2 = req.body["spotst2"];
	const endobrev = req.body["endobrev"];
	makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev).then((predictions) => {
		res.send(predictions);
	}).catch((err) => {
		re.send(err);
	});
});

>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
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

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 8f9dcbef5b2f9a7c19b41a714708c200836444c0
