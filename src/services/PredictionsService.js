import { makePredictions } from '../runRModel';

export default class PredictionsService {
  static async getPredictions(req, data) {
    return new Promise((resolve, reject) => {
      // if the user selected a specific national forest or forest, simply run the model
      if ((req.body.nf !== undefined && req.body.nf !== null && req.body.nf !== '') || (req.body.forest !== undefined && req.body.forest !== null && req.body.forest !== '')) {
        // initialize input counts
        const modelInputs = {
          SPB: null,
          cleridst1: null,
          spotst1: null,
          spotst2: null,
          endobrev: req.body.endobrev,
          stateCode: null,
          forestCode: null,
          forest: '',
        };
        console.log(data);
        // sum up inputs across these filters
        for (const entry in data) {
          modelInputs.stateCode = data[entry].stateCode;
          modelInputs.forestCode = data[entry].forestCode;
          modelInputs.forest = data[entry].forest;
          
          if (data[entry].year === parseInt(req.body.targetYear)) {
            if (data[entry].spbPerTwoWeeks != undefined) {
              modelInputs.SPB += data[entry].spbPerTwoWeeks;
            }
          }

          if (data[entry].year === parseInt(req.body.targetYear - 1)) {
            if (data[entry].spots != undefined) {
              modelInputs.spotst1 += data[entry].spots;
            }

            if (data[entry].cleridsPerTwoWeeks != undefined) {
              modelInputs.cleridst1 += data[entry].cleridsPerTwoWeeks;
            }

          } else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
            if (data[entry].spots != undefined) {
              modelInputs.spotst2 += data[entry].spots;
            }
          }
        }
        console.log(modelInputs);
        const missingData = Object.values(modelInputs).includes(null);
        if (missingData) {
          resolve({
            inputs: modelInputs,
            outputs: null,
          });
        }

        // make prediction
        const results = makePredictions(modelInputs.SPB, modelInputs.cleridst1, modelInputs.spotst1, modelInputs.spotst2, modelInputs.endobrev);

        // get results
        const expSpotsIfOutbreak = results[2].Predictions;
        const spots0 = results[3].Predictions;
        const spots19 = results[4].Predictions;
        const spots53 = results[5].Predictions;
        const spots147 = results[6].Predictions;
        const spots402 = results[7].Predictions;
        const spots1095 = results[8].Predictions;

        const predictions = [spots0, spots19, spots53, spots147, spots402, spots1095, expSpotsIfOutbreak];

        const predPromise = Promise.resolve(predictions);

        predPromise.then((value) => {
          // put model outputs into JSON object
          const outputs = {
            prob0spots: value[0],
            prob19spots: value[1],
            prob53spots: value[2],
            prob147spots: value[3],
            prob402spots: value[4],
            prob1095spots: value[5],
            expSpotsIfOutbreak: value[6],
          };
          resolve({
            inputs: modelInputs,
            outputs,

          });
        });
      }
      // split the data up by forests, determine representative forests of the sample, run the model on only representative forests
      else {
        // separate all data by forest
        const forestsData = {};

        // sum up inputs across these filters
        for (const entry in data) {
          const forestNames = [data[entry].forest, data[entry].nf];
          const obj = [null, null];

          // repeat for forest and national forest
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < obj.length; i++) {
            // if there is a forest to grab, find object, otherwise create one
            if (forestNames[i] !== null && forestNames[i] !== '') {
              if (forestsData[forestNames[i]] !== undefined) {
                obj[i] = forestsData[forestNames[i]];
              } else {
                obj[i] = {
                  SPB: 0,
                  cleridst1: 0,
                  spotst1: 0,
                  spotst2: 0,
                  endobrev: req.body.endobrev,
                };
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
              } else if (data[entry].year === parseInt(req.body.targetYear - 2)) {
                if (data[entry].spots !== undefined) {
                  obj[i].spotst2 += data[entry].spots;
                }
              }

              forestsData[forestNames[i]] = obj[i];
            }
          }
        }

        // grab array of spots values
        const spots = [];
        for (const forest in forestsData) {
          spots.push(forestsData[forest].spotst1);
        }

        // compute mean and standard deviation of observed spots
        const meanSpots = math.mean(spots);
        const sdSpots = math.std(spots);

        // get count of number of forests chosen then determine number of forests to run the model on
        const numForests = Object.keys(forestsData).length;
        const numForestsForModel = parseInt(numForests / 4);

        // construct object for forests to run the model on
        const forestsDataForModel = {};
        let forestsAdded = 0;

        // get representative forests to run the model on
        for (const forest in forestsData) {
          if (forestsAdded < numForestsForModel) {
            // determine if this spots value is within one standard deviation of the mean
            if (forestsData[forest].spotst1 >= meanSpots - sdSpots && forestsData[forest].spotst1 <= meanSpots + sdSpots) {
              forestsDataForModel[forest] = forestsData[forest];
              delete forestsData[forest];
              forestsAdded += 1;
            }
          }
        }

        // initialize a collection of sums
        const sums = {
          expSpotsIfOutbreak: 0,
          spots0: 0,
          spots19: 0,
          spots53: 0,
          spots147: 0,
          spots402: 0,
          spots1095: 0,
        };

        const outputSums = {
          SPB: 0,
          cleridst1: 0,
          spotst1: 0,
          spotst2: 0,
        };

        // run model on each representative forest
        for (const forest in forestsDataForModel) {
          // add to outputSums
          outputSums.SPB += forestsDataForModel[forest].SPB;
          outputSums.cleridst1 += forestsDataForModel[forest].cleridst1;
          outputSums.spotst1 += forestsDataForModel[forest].spotst1;
          outputSums.spotst2 += forestsDataForModel[forest].spotst2;

          // make prediction
          const results = makePredictions(forestsDataForModel[forest].SPB, forestsDataForModel[forest].cleridst1, forestsDataForModel[forest].spotst1, forestsDataForModel[forest].spotst2, forestsDataForModel[forest].endobrev);

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
        const averageModelInputs = {
          SPB: outputSums.SPB / numForestsForModel,
          cleridst1: outputSums.cleridst1 / numForestsForModel,
          spotst1: outputSums.spotst1 / numForestsForModel,
          spotst2: outputSums.spotst2 / numForestsForModel,
        };

        const predictions = [sums.spots0 / numForestsForModel, sums.spots19 / numForestsForModel, sums.spots53 / numForestsForModel, sums.spots147 / numForestsForModel, sums.spots402 / numForestsForModel, sums.spots1095 / numForestsForModel, sums.expSpotsIfOutbreak / numForestsForModel];
        const predPromise = Promise.resolve(predictions);

        predPromise.then((value) => {
          // put model outputs into JSON object
          const outputs = {
            prob0spots: value[0],
            prob19spots: value[1],
            prob53spots: value[2],
            prob147spots: value[3],
            prob402spots: value[4],
            prob1095spots: value[5],
            expSpotsIfOutbreak: value[6],
          };
          resolve({
            'inputs': averageModelInputs,
            outputs,
          });
          return {
            inputs: averageModelInputs,
            outputs,
          };
        });
      }
    });
  }


  static async predictSpots(SummarizedDataDTO) {
    // get model inputs

    const SPB = parseInt(SummarizedDataDTO.SPB, 10);
    const cleridst1 = parseInt(SummarizedDataDTO.cleridst1, 10);
    const spotst1 = parseInt(SummarizedDataDTO.spotst1, 10);
    const spotst2 = parseInt(SummarizedDataDTO.spotst2, 10);
    const endobrev = parseInt(SummarizedDataDTO.endobrev,10);

    // make prediction
    const results = makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev);
    // grab results
    const expSpotsIfOutbreak = results[2].Predictions;
    const spots0 = results[3].Predictions;
    const spots19 = results[4].Predictions;
    const spots53 = results[5].Predictions;
    const spots147 = results[6].Predictions;
    const spots402 = results[7].Predictions;
    const spots1095 = results[8].Predictions;

    // resolve promise
    const predictions = [spots0, spots19, spots53, spots147, spots402, spots1095, expSpotsIfOutbreak];
    //   // put model outputs into JSON object
    const predictionsJson = {
      prob0spots: predictions[0],
      prob19spots: predictions[1],
      prob53spots: predictions[2],
      prob147spots: predictions[3],
      prob402spots: predictions[4],
      prob1095spots: predictions[5],
      expSpotsIfOutbreak: predictions[6],
    };

    return predictionsJson;
    // });
  }

  // Takes predictions from get getPredictions functions along with historical data
  // and returns an analysis for true positive/false positive analysis
  static comparePredictionOutcome(predictionOutputs, outcome) {
    if (outcome.length === 0 || outcome[0].spots === null) {
      return {
        forest: predictionOutputs.inputs.forest,
        predictions: null,
        spots: null,
        outbreakOcurred: null,
        outbreakPredicted: null,
        missingData: true,
      };
    }
    // Unpacking data
    const predictions = predictionOutputs.outputs;
    const outcomeSpots = outcome[0].spots;

    // Whether an outbreak occured or was predicted
    const outbreakOcurred = outcomeSpots > 53;
    const outbreakPredicted = predictions.prob53spots > 0.5;
    return {
      forest: predictionOutputs.inputs.forest,
      predictions,
      spots: outcomeSpots,
      outbreakOcurred,
      outbreakPredicted,
      missingData: false,
    };
  }
}
