# Summarized County Data Operations

## `GET /summarized-county`

Returns summarized county objects that match specified query params.

User can supply query params for:

- `county`
- `state`
- `year`
- `FIPS`
- `hasSPBTrapping`
- `isValidForPrediction`
- `hasSpotst0`
- `hasPredictionAndOutcome`
- `endobrev`
- `totalTrappingDays`
- `trapCount`
- `daysPerTrap`
- `spbCount`
- `spbPer2Weeks`
- `spbPer2WeeksOrig`
- `cleridsPer2Weeks`
- `cleridst1`
- `spotst0`
- `spotst1`
- `spotst2`
- `pi`
- `mu`
- `expSpotsIfOutbreak`
- `probSpotsGT0`
- `probSpotsGT20`
- `probSpotsGT50`
- `probSpotsGT150`
- `probSpotsGT400`
- `probSpotsGT1000`
- `ln(spbPer2Weeks+1)`
- `ln(cleridsPer2Weeks+1)`
- `ln(spotst0+1)`
- `logit(Prob>50)`
- `predSpotslogUnits`
- `predSpotsorigUnits`
- `residualSpotslogUnits`

If no query params are provided, the route will return all data.

## `POST /summarized-county/query`

Returns summarized county objects that match provided MongoDB-style query. Requires auth.

User can supply MongoDB-style query in body.

## `GET /summarized-county/aggregate/year`

Returns calculated fields for data grouped by years. The calculated fields are averages, sums, and ranges for SPB, clerids, and spots.

User can filter the data used to compute the returned fields with the following query params:

- `county`
- `state`
- `startYear`
- `endYear`

## `GET /summarized-county/aggregate/state`

Returns calculated fields for data grouped by state. The calculated fields compute averages, sums, and ranges for SPB, clerids, and spots.

User can filter the data used to compute the returned fields with the following query params:

- `county`
- `state`
- `startYear`
- `endYear`

## `GET /summarized-county/aggregate/county`

Returns calculated fields for data grouped by county. The calculated fields compute averages, sums, and ranges for SPB, clerids, and spots.

User can filter the data used to compute the returned fields with the following query params:

- `county`
- `state`
- `startYear`
- `endYear`

## `GET /summarized-county/years/list`

Returns a list of sorted years represented in the data.

User can filter the data with the following query params:

- `county`
- `state`
- `isHistorical` -- whether or not to filter on just historical data
- `isPrediction` -- whether or not to filter on just prediction data

## `GET /summarized-county/states/list`

Returns a list of sorted state names represented in the data.

User can filter the data with the following query params:

- `startYear`
- `endYear`
- `isHistorical` -- whether or not to filter on just historical data
- `isPrediction` -- whether or not to filter on just prediction data

## `GET /summarized-county/counties/list`

Returns a list of sorted county names represented in the data.

User can filter the data with the following query params:

- `state`
- `startYear`
- `endYear`
- `isHistorical` -- whether or not to filter on just historical data
- `isPrediction` -- whether or not to filter on just prediction data
