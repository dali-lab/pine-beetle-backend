# Unsummarized Trapping Data Operations

## `GET /unsummarized-trapping`

Returns unsummarized trapping objects that match specified query params.

User can supply query params for:

- `bloom`
- `bloomDate`
- `cleridCount`
- `collectionDate`
- `county`
- `daysActive`
- `endobrev`
- `FIPS`
- `globalID`
- `latitude`
- `longitude`
- `lure`
- `rangerDistrict`
- `season`
- `sirexLure`
- `spbCount`
- `startDate`
- `state`
- `trap`
- `year`
- `startYear`
- `endYear`

## `POST /unsummarized-trapping/query`

Returns unsummarized trapping objects that match provided MongoDB-style query. Requires auth.

User can supply MongoDB-style query in body.
