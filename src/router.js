import express, { Router } from 'express';
import math from 'mathjs';
import historicalController from './controllers/HistoricalController';
import sampleController from './controllers/SampleController';
import trappingDataController from './controllers/TrappingDataController';
import { makePredictions } from './runRModel';
import upload from './importing-scripts/uploadSurvey123toMongo';
import summarizeTrappingData from './importing-scripts/summarizeTrappingData';
import PredictionsService from './services/PredictionsService';
import HistoricalService from './services/HistoricalService';

const router = express();


/***************************/
/* HISTORICAL CONTROLLERS  */
/***************************/

router.post('/uploadHistorical', (req, res) => {
  const data = req.body;
  console.log(data);
  historicalController.uploadHistorical(data).then((uploaded) => {
    res.send(uploaded);
  }).catch((err) => {
    console.log(err);
  });
});

// get all items in the database
router.get('/getHistoricals', (req, res) => {
  historicalController.getHistoricalData().then((data) => {
    res.send(data);
  });
});

// get all items with passed filter
router.post('/getHistoricalsFilter', (req, res) => {
  historicalController.getHistoricalDataFilter(req.body).then((data) => {
    res.send(data);
  });
});

const findYearObject = (collection, year) => {
  for (const i in collection) {
    if (collection[i].year === year) {
      return i;
    }
  }
  return null;
};

// get all items with passed filter, then summarize based on year
router.post('/getSummarizedDataByYearFilter', (req, res) => {
  const queryFields = req.body;
  historicalController.getHistoricalDataFilter(queryFields).then((data) => {
    var b = new HistoricalService()
    const summarizedDataByYear = b.FilterDataByYear(queryFields, data);
    res.send(summarizedDataByYear);
  });
});

const findLatLongObject = (collection, lat, long) => {
  for (const i in collection) {
    if (collection[i].latitude === lat && collection[i].longitude === long) {
      return i;
    }
  }
  return null;
};

// get all items with passed filter, then summarize based on year
router.post('/getSummarizedDataByLatLongFilter', (req, res) => {
  const queryFields = req.body;
  historicalController.getHistoricalDataFilter(queryFields).then((data) => {
    var a = new HistoricalService()
    const summarizedDataByLatLong = a.FilterDataByLatLog(queryFields, data);
    res.send(summarizedDataByLatLong);
  });
});

const findStateObject = (collection, state) => {
  for (const i in collection) {
    if (collection[i].state === state) {
      return i;
    }
  }
  return null;
};

// get all items with passed filter, then summarize based on year
router.post('/getSummarizedDataByState', (req, res) => {
  historicalController.getDataForSingleYear(req.body).then((data) => {
    const summarizedDataByState = HistoricalService.FilterDataByState(data);
    res.send(summarizedDataByState);
  });
});

// get the first year present in the database
router.get('/getMinimumYear', (req, res) => {
  historicalController.getMinimumYear().then((data) => {
    res.send(data[0].year.toString());
  });
});

// get the most recent year present in the database
router.get('/getMaximumYear', (req, res) => {
  historicalController.getMaximumYear().then((data) => {
    res.send(data[0].year.toString());
  });
});

// get all unique states in the database
router.get('/getUniqueStates', (req, res) => {
  historicalController.getUniqueStates().then((data) => {
    res.send(data.filter((state) => { return state !== ''; }));
  });
});

// get all unique years in the database
router.get('/getUniqueYears', (req, res) => {
  historicalController.getUniqueYears().then((data) => {
    var sorted_years = data.filter((year) => { return year !== ''; }).sort()
    res.send(sorted_years)
  });
});

// get all unique years in the database
router.post('/getUniqueNationalForests', (req, res) => {
  historicalController.getUniqueNationalForests(req.body.stateAbbreviation).then((data) => {
    res.send(data.filter((nf) => { return nf !== ''; }));
  });
});

// get all unique years in the database
router.post('/getUniqueLocalForests', (req, res) => {
  historicalController.getUniqueLocalForests(req.body.stateAbbreviation).then((data) => {
    res.send(data.filter((forest) => { return forest !== ''; }));
  });
});

// run the R model on forest if specified, otherwise on entire state
router.post('/getPredictions', (req, res) => {
  if (req.body.state === null || req.body.state === undefined) {
    return res.status(400).send({message: 'Cannot run the model on the entire nation. Please specify a state and/or forest.',});
  } else {
    historicalController.getDataForPredictiveModel(req.body).then((data) => {
      var a = new PredictionsService();
      a.GetPredictions(req, data).then((output) => {
        res.send(output)
      });
    });
  }
});

// Returns Spot Predictions
// Input is historical data (summarized trapping data)
router.post('/getCustomPredictions', (req, res) => {
  const SummarizedDataDTO = req.body;
  const predictionsOutput = PredictionsService.PredictSpots(SummarizedDataDTO);
  res.send(predictionsOutput);
});

/***************************/
/*TRAPPING DATA CONTROLLERS*/
/***************************/

router.get('/getSpots', (req, res) => {
  trappingDataController.getSpotData().then((data) => {
    res.send(data);
  });
});

router.get('/getBeetles', (req, res) => {
  sampleController.getSampleData().then((data) => {
    res.send(data);
  });
});

router.post('/uploadSurvey123', (req, res) => {

  // get the data from S123 using axios, then with that...
  upload.getData(req.body.token).then((data) => {
    // format to spot array
    trappingDataController.formatToSpot(data, req.body)
      .then((trappingData) => {
        trappingDataController.uploadTrappingData(trappingData);

        summarizeTrappingData.formatToHist(trappingData)
          .then((histData) => {
            historicalController.uploadHistData(histData);
            res.send(histData);
          })
          .catch((error) => {
            res.send(error);
          });
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});


router.post('/uploadSurvey123Fake', (req, res) => {
  res.send([{
    hello: 'WORLD',
    test: 1,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },
  {
    hello: 'WORLD',
    test: 2,
  },

  ]);
});

export default router;
