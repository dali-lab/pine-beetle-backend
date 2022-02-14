# Summarized Ranger District Data Operations

## `GET /summarized-rangerdistrict`

Returns summarized ranger district objects that match specified query params.

User can supply query params for:

- `rangerDistrict`
- `state`
- `year`
- `federalNameOld`
- `federalNameOlder`
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

## `POST /summarized-rangerdistrict/query`

Returns summarized ranger district objects that match provided MongoDB-style query. Requires auth.

User can supply MongoDB-style query in body.

## `GET /summarized-rangerdistrict/aggregate/year`

Returns calculated fields for data grouped by years. The calculated fields are averages, sums, and ranges for SPB, clerids, and spots.

User can filter the data used to compute the returned fields with the following query params:

- `rangerDistrict`
- `state`
- `startYear`
- `endYear`

## `GET /summarized-rangerdistrict/aggregate/state`

Returns calculated fields for data grouped by state. The calculated fields compute averages, sums, and ranges for SPB, clerids, and spots.

User can filter the data used to compute the returned fields with the following query params:

- `rangerDistrict`
- `state`
- `startYear`
- `endYear`

## `GET /summarized-rangerdistrict/aggregate/rangerDistrict`

Returns calculated fields for data grouped by ranger district. The calculated fields compute averages, sums, and ranges for SPB, clerids, and spots.

User can filter the data used to compute the returned fields with the following query params:

- `rangerDistrict`
- `state`
- `startYear`
- `endYear`

## `GET /summarized-rangerdistrict/years/list`

Returns a list of sorted years represented in the data.

User can filter the data with the following query params:

- `rangerDistrict`
- `state`
- `isHistorical` -- whether or not to filter on just historical data
- `isPrediction` -- whether or not to filter on just prediction data

## `GET /summarized-rangerdistrict/states/list`

Returns a list of sorted state names represented in the data.

User can filter the data with the following query params:

- `startYear`
- `endYear`
- `isHistorical` -- whether or not to filter on just historical data
- `isPrediction` -- whether or not to filter on just prediction data

## `GET /summarized-rangerdistrict/counties/list`

Returns a list of sorted rangerdistrict names represented in the data.

User can filter the data with the following query params:

- `state`
- `startYear`
- `endYear`
- `isHistorical` -- whether or not to filter on just historical data
- `isPrediction` -- whether or not to filter on just prediction data
